import express from "express";

const createServer = (config) => {
  const app = express();

  const routesArr = config.routes;

  routesArr.forEach(({ method, path, status, delay, response }) => {
    app[method.toLowerCase()](path, (req, res) => {
      try {
        setTimeout(() => {
          return res.status(status).json(response);
        }, delay);
      } catch (error) {
        console.log(error.message);
      }
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  return app;
};

export default createServer;
