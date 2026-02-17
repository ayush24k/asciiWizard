import { parentPort } from "worker_threads";
import { AsciiRenderer } from "../core/ascii/AsciiRenderer";

interface WorkerInput {
    frame: Uint8Array;
    width: number;
    height: number;
    charset: string;
}

if (!parentPort) {
    process.exit(1);
}

parentPort.on("message", (data: WorkerInput) => {
    try {
        const renderer = new AsciiRenderer(data.charset);

        const ascii = renderer.render({
            data: data.frame,
            width: data.width,
            height: data.height
        });

        parentPort!.postMessage(ascii);
    } catch (err: any) {
        if (parentPort) parentPort.postMessage({ error: err.message });
    }
});
