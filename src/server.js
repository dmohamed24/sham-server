import express from "express";
import { arrIsSame } from "../utility/arrIsSame.js";

const createServer = (config) => {
  const app = express();

  app.use(express.json());

  const routesArr = config.routes;

  routesArr.forEach(({ method, path, status, delay, response, match }) => {
    app[method.toLowerCase()](path, (req, res) => {
      try {
        if (method == "POST") {
          if (!req.body.length) {
            return res.status(500).json({ message: "Server error" });
          }

          if (!arrIsSame(Object.keys(match.body), Object.keys(req.body))) {
            return res
              .status(400)
              .json({ message: "The schema doesn't match" });
          }
        }

        setTimeout(() => {
          return res.status(status).json(response);
        }, delay);
      } catch (error) {
        console.error(`[sham-server error] ${error.message}`);
        res.status(500).json({ message: "[sham-server] Internal tool error" });
      }
    });
  });

  return app;
};

export default createServer;
