import { AsciiRenderer } from "./AsciiRenderer";

const width = 20;
const height = 10;

// Create gradient test buffer
const buffer = new Uint8Array(width * height);

for (let i = 0; i < buffer.length; i++) {
  buffer[i] = Math.floor((i / buffer.length) * 255);
}

const renderer = new AsciiRenderer("@%#*+=-:. ");

const ascii = renderer.render({
  data: buffer,
  width,
  height
});

console.log(ascii);
