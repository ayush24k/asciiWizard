#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
    .name("asciiWizard")
    .description("Converts an image, videos and webcam stream to ASCII art")
    .version("0.0.1")

program
    .command("image <path>")
    .description("Converts an image to ASCII art")
    .option("--width <number>", "output width", "100")
    .option("--color <color>", "foreground color")
    .option("--bg <color>", "background color")
    .action((path, options) => {
        console.log("Image command triggered");
        console.log({path, options});
    })

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