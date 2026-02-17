import { Worker } from "worker_threads";
import path from "path";

export class WorkerPool {
    private workers: Worker[] = [];
    private queue: any[] = [];
    private busy = new Set<Worker>();
    private terminating = false;

    constructor(size: number) {
        for (let i = 0; i < size; i++) {
            const workerPath = path.resolve(__dirname, "../../workers/frameWorker.js");

            const worker = new Worker(workerPath);

            worker.on("message", (result) => {
                const callback = (worker as any)._callback;
                if (callback) callback(result);

                this.busy.delete(worker);
                (worker as any)._callback = null;
                (worker as any)._reject = null;
                this.processQueue();
            });

            worker.on("error", (err) => {
                console.error("Worker error:", err);
                const reject = (worker as any)._reject;
                if (reject) reject(err);

                this.busy.delete(worker);
                this.processQueue();
            });

            worker.on("exit", (code) => {
                if (code !== 0 && !this.terminating) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
            });

            this.workers.push(worker);
        }
    }

    // We need to track the resolve/reject callbacks.
    // The provided implementation attached it to the worker instance implicitly.
    // I will follow the plan's approach.

    runTask(data: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.queue.push({ data, resolve, reject });
            this.processQueue();
        });
    }

    private processQueue() {
        if (this.queue.length === 0) return;

        const available = this.workers.find(
            (w) => !this.busy.has(w)
        );

        if (!available) return;

        const task = this.queue.shift();
        this.busy.add(available); // Add purely the worker reference to set

        // Store callbacks on the worker instance (as any)
        (available as any)._callback = task.resolve;
        (available as any)._reject = task.reject;

        available.postMessage(task.data);
    }

    terminate() {
        this.terminating = true;
        this.workers.forEach(w => w.terminate());
    }
}
