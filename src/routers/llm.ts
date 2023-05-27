import express from "express";
import { handleChat, handleChatWithFree } from "~/controllers/post.llm";

const router = express.Router();
router.post("/talk", handleChat);
router.post("/talk-with-free", handleChatWithFree);

export default router;
