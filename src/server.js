import express from "express";

const app = express();
const port = 3000;

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
