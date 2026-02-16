import { CharMap } from "./CharMap";

export interface RenderInput {
  data: Uint8Array; // grayscale buffer
  width: number;
  height: number;
}

export class AsciiRenderer {
  private charMap: CharMap;

  constructor(charset: string) {
    this.charMap = new CharMap(charset);
  }

  render(input: RenderInput): string {
    const { data, width, height } = input;

    if (data.length !== width * height) {
      throw new Error("Buffer size does not match width × height");
    }

    let output = "";

    for (let y = 0; y < height; y++) {
      let line = "";

      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const brightness = data[index] ?? 0;

        line += this.charMap.mapBrightness(brightness);
      }

      output += line + "\n";
    }

    return output;
  }
}
