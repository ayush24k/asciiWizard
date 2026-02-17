import { createFrameStream } from "../../infra/ffmpeg/FrameStream";
import { AsciiRenderer } from "../../core/ascii/AsciiRenderer";
import { defaultConfig } from "../../config/defaultConfig";
import { Colorizer } from "../../core/ascii/Colorizer";
import { WorkerPool } from "./WorkerPool";
import os from "os";

export interface VideoOptions {
    width?: number;
    fps?: number;
    charset?: string;
    color?: string;
    background?: string;
}

export async function playAsciiVideo(
    path: string,
    options: VideoOptions = {}
) {
    const width = options.width ?? defaultConfig.width;
    const fps = options.fps ?? defaultConfig.fps!;
    const charset = options.charset ?? defaultConfig.charset!;

    const renderer = new AsciiRenderer(charset);
    const colorizer = new Colorizer({
        ...(options.color ? { fg: options.color } : {}),
        ...(options.background ? { bg: options.background } : {})
    });

    const pool = new WorkerPool(Math.max(1, os.cpus().length - 1));

    const stream = createFrameStream({
        path,
        width,
        fps
    });

    const frameHeight = Math.floor(width * 0.55);
    const frameSize = width * frameHeight;

    let buffer = Buffer.alloc(0);

    stream.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length >= frameSize) {
            const frame = buffer.slice(0, frameSize);
            buffer = buffer.slice(frameSize);

            pool.runTask({
                frame: new Uint8Array(frame),
                width,
                height: frameHeight,
                charset
            }).then((ascii) => {
                renderFrame(colorizer.apply(ascii));
            }).catch(console.error);
        }
    });

    stream.on("error", (err) => {
        console.error("Stream error:", err);
    });

    stream.on("end", () => {
        pool.terminate();
        console.log("\nVideo finished.");
    });
}

function renderFrame(frame: string) {
    process.stdout.write("\x1b[2J"); // clear screen
    process.stdout.write("\x1b[0f"); // move cursor top
    process.stdout.write(frame);
}
