import cors from "cors";
import express from "express";

import { config } from "./config.js";
import { connectDatabase } from "./db.js";
import { authRouter } from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({
      message: "Unexpected server error.",
    });
  },
);

await connectDatabase();

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
