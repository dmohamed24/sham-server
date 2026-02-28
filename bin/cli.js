#!/usr/bin/env node

import fs from "node:fs";
import path from "path";

import { Command } from "commander";
import app from "../src/server";

// console.log(import.meta.dirname);
// console.log(import.meta.filename);
// console.log(path.dirname("../"));

const program = new Command();

program
  .name("sham-server")
  .description(
    "A command-line tool that reads a JSON or YAML config file and spins up a local HTTP server that serves fake API endpoints",
  )
  .version("1.0.0");

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log(JSON.parse(data));

    return data;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
};

// Defining a command with an option
program
  .command("mock")
  .argument("<path>", ".config file path")
  .description("Config file path to mock an api server")
  .option("-p, --port <port>", "override port value in the config")
  .action((filePath, options) => {
    //options.port

    try {
      const data = readFile(filePath);

      const port = options.port || data.part;

      // Start the server
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    } catch (error) {
      console.log(error.message);
    }
  });

program.parse(process.argv);
