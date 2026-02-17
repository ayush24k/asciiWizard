#!/usr/bin/env node

import { Command } from "commander";
import { convertImageToAscii } from "../application/image/convertImageToAscii";
import { playAsciiVideo } from "../application/video/playAsciiVideo";
import { parseCommonOptions } from "./utils/parseOptions";
import { validateWidth, validateFPS } from "./utils/validate";

process.on("unhandledRejection", (err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});



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
  .option("--color <color>", "Foreground color")
  .option("--bg <color>", "Background color")
  .option("--charset <chars>", "ASCII charset")
  .action(async (path, options) => {
    try {
      const parsed = parseCommonOptions(options);
      validateWidth(parsed.width);

      await convertImageToAscii(path, {
        width: parsed.width,
        charset: parsed.charset,
        color: parsed.color,
        background: parsed.background,
        output: options.out
      });

    } catch (err: any) {
      console.error("Error:", err.message);
    }
  });


program
  .command("video <path>")
  .description("Convert video to ASCII")
  .option("--width <number>", "Width", "100")
  .option("--fps <number>", "FPS", "24")
  .option("--color <color>", "Foreground color")
  .option("--bg <color>", "Background color")
  .option("--charset <chars>", "ASCII charset")
  .action(async (path, options) => {
    try {
      const parsed = parseCommonOptions(options);
      validateWidth(parsed.width);
      validateFPS(parsed.fps);

      process.stdout.write("\x1B[?25l");
      await playAsciiVideo(path, parsed);

    } catch (err: any) {
      console.error("Error:", err.message);
    } finally {
      process.stdout.write("\x1B[?25h");
    }
  });


program
  .command("live")
  .description("Start live webcam ASCII mode")
  .action(() => {
    console.log("Live mode triggered");
  });


program.configureHelp({
  sortSubcommands: true
});

program.addHelpText("after", `

Examples:

  $ ascii-cli image photo.png
  $ ascii-cli image photo.png --width 120 --color green
  $ ascii-cli video movie.mp4 --fps 15
`);

program.parse();