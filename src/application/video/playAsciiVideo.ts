import { createFrameStream } from "../../infra/ffmpeg/FrameStream";
import { AsciiRenderer } from "../../core/ascii/AsciiRenderer";
import { defaultConfig } from "../../config/defaultConfig";

export interface VideoOptions {
  width?: number;
  fps?: number;
  charset?: string;
}

export async function playAsciiVideo(
  path: string,
  options: VideoOptions = {}
) {
  const width = options.width ?? defaultConfig.width;
  const fps = options.fps ?? defaultConfig.fps!;
  const charset = options.charset ?? defaultConfig.charset!;

  const renderer = new AsciiRenderer(charset);

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

      const ascii = renderer.render({
        data: new Uint8Array(frame),
        width,
        height: frameHeight
      });

      renderFrame(ascii);
    }
  });

  stream.on("end", () => {
    console.log("\nVideo finished.");
  });
}

function renderFrame(frame: string) {
  process.stdout.write("\x1b[2J"); // clear screen
  process.stdout.write("\x1b[0f"); // move cursor top
  process.stdout.write(frame);
}
