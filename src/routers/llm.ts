import express from "express";
import { handleChat } from "~/controllers/post.llm";

const router = express.Router();

router.post("/talk", handleChat);

export default router;
