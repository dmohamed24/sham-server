#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import app from "../src/server.js";

// console.log(import.meta.dirname);
// console.log(import.meta.filename);
// console.log(path.dirname("../"));

const program = new Command();

program
  .name("sham-server")
  .description(
    "A command-line tool that reads a JSON or YAML config file and spins up a local HTTP server",
  )
  .version("1.0.0");

const readFile = (filePath) => {
  try {
    const rawJson = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawJson);
  } catch (error) {
    console.error(`Failed to read config: ${error.message}`);
    process.exit(1);
  }
};

program
  .command("mock")
  .argument("<filePath>", "config file path")
  .description("Start a mock API server from a config file")
  .option("-p, --port <port>", "override port value in the config")
  .action((filePath, options) => {
    const data = readFile(filePath);
    const port = options.port || data.port || 3000;

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });

program.parse(process.argv);
