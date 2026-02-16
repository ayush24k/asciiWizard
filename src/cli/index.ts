#!/usr/bin/env node

import { Command } from "commander";
import { convertImageToAscii } from "../application/image/convertImageToAscii";

const program = new Command();

program
    .name("asciiWizard")
    .description("Converts an image, videos and webcam stream to ASCII art")
    .version("0.0.1")

program
    .command("image <path>")
    .description("Convert image to ASCII")
    .option("--width <number>", "Output width", "100")
    .option("--out <file>", "Save to file")
    .action(async (path, options) => {
      try {
        await convertImageToAscii(path, {
          width: Number(options.width),
          output: options.out
        });
      } catch (err) {
        console.error("Error:", err);
    }
  });


program
  .command("video <path>")
  .description("Convert video to ASCII")
  .action((path) => {
    console.log("Video command triggered:", path);
  });

program
  .command("live")
  .description("Start live webcam ASCII mode")
  .action(() => {
    console.log("Live mode triggered");
  });

program.parse();