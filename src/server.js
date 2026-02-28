import express from "express";

const createServer = (config) => {
  const app = express();

  console.log(config);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  return app;
};

export default createServer;
