import express from "express";
import { handleChat, handleChatWithFree, test } from "~/controllers/post.llm";

const router = express.Router();
router.post("/talk", handleChat);
router.post("/talk-with-free", handleChatWithFree);
router.post("/test", test);

export default router;
