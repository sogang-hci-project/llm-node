import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import { isProd } from "~/constants";
import { LLMRouter } from "~/routers";

const app = express();

app.set("port", 5000);

if (isProd) {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/talke", (req, res) => {
  const { user } = req.body;
  if (!user) return res.status(400).json({ message: "inccorect data" });
  res.send("connect success");
});

app.use("/api/v1", LLMRouter);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(210).json({ message: "LLM 서버 내부 오류가 발생했습니다.", error });
  next();
});

app.listen(app.get("port"), () => {
  console.log(`listening on http://localhost:${app.get("port")}`);
});
