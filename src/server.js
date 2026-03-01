import express from "express";

const createServer = (config) => {
  const app = express();

  app.use(express.json());

  const routesArr = config.routes;

  routesArr.forEach(
    ({ method, path, status, delay, response, match, simulateError }) => {
      app[method.toLowerCase()](path, (req, res) => {
        try {
          const needsValidation = ["POST", "PUT", "PATCH"].includes(
            method.toUpperCase(),
          );

          if (simulateError && req.query.simulatedError === true) {
            return res
              .status(simulateError.status)
              .json(simulateError.response);
          }

          if (needsValidation) {
            if (!req.body) {
              console.log(!req.body, "expected");
              return res.status(422).json({
                message: "Validation error",
                missing: Object.keys(match.body),
              });
            }

            const requiredKeys = Object.keys(match.body);
            const missingKeys = requiredKeys.filter(
              (key) => !(key in req.body),
            );

            if (missingKeys.length > 0) {
              return res.status(422).json({
                message: "Validation error",
                missing: missingKeys,
              });
            }
          }

          setTimeout(() => {
            return res.status(status).json(response);
          }, delay);
        } catch (error) {
          console.error(`[sham-server error] ${error.message}`);
          res
            .status(500)
            .json({ message: "[sham-server] Internal tool error" });
        }
      });
    },
  );

  return app;
};

export default createServer;
