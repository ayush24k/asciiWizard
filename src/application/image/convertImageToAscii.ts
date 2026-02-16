import { ImageProcessor } from "../../infra/image/ImageProcessor";
import { AsciiRenderer } from "../../core/ascii/AsciiRenderer";
import { defaultConfig } from "../../config/defaultConfig";
import fs from "fs/promises";

export interface ImageAsciiOptions {
  width?: number;
  charset?: string;
  output?: string;
}

export async function convertImageToAscii(
  path: string,
  options: ImageAsciiOptions = {}
) {
  const width = options.width ?? defaultConfig.width;
  const charset = options.charset ?? defaultConfig.charset!;

  const processor = new ImageProcessor();
  const renderer = new AsciiRenderer(charset);

  const image = await processor.loadGrayscale(path, width);

  const ascii = renderer.render(image);

  console.log(ascii);

  if (options.output) {
    await fs.writeFile(options.output, ascii);
    console.log("Saved to:", options.output);
  }
}
