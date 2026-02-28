#!/usr/bin/env node

import { Command } from "commander";
import { readConfigFile } from "../utility/readConfigFile.js";
import createServer from "../src/server.js";

const program = new Command();

program
  .name("sham-server")
  .description(
    "A command-line tool that reads a JSON or YAML config file and spins up a local HTTP server",
  )
  .version("1.0.0");

program
  .command("mock")
  .argument("<filePath>", "config file path")
  .description("Start a mock API server from a config file")
  .option("-p, --port <port>", "override port value in the config")
  .action((filePath, options) => {
    const data = readConfigFile(filePath);
    const port = options.port || data.port || 3000;
    const app = createServer(data);
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });

program.parse(process.argv);
