import fs from "node:fs";

export const readConfigFile = (filePath) => {
  try {
    const rawJson = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawJson);
  } catch (error) {
    console.error(`Failed to read config: ${error.message}`);
    process.exit(1);
  }
};

// console.log(import.meta.dirname);
// console.log(import.meta.filename);
// console.log(path.dirname("../"));
// import path from "node:path";
