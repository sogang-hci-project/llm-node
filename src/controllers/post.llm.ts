import { NextFunction, Request, Response } from "express";

import { chainInitializer, dbTemplate, dbTemplateNoQuiz, redisClient } from "~/lib";

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionId, additional } = req.body;

    if (!user || !sessionId) return res.status(400).json({ message: "incorrect LLM data" });
    let context = await redisClient.get(sessionId);
    if (!context) context = `context:`;
    const chain = await chainInitializer({ free: false });
    context += `\n${user}`;
    const query = `${additional ? dbTemplate : dbTemplateNoQuiz}\n${context}`;

    const result = await chain.call({
      query,
    });
    const { text } = result;
    context += `\n${text}`;
    redisClient.set(sessionId, context);

    // 정규식을 사용하여 Answer: 뒤에 있는 문장 추출
    const answerRegex = /Answer:\s*(.*)/;
    const answerMatch = text.match(answerRegex);
    const answer = answerMatch ? answerMatch[1] : "answer none";

    // 정규식을 사용하여 Quiz: 뒤에 있는 문장 추출
    const quizRegex = /Quiz:\s*(.*)/;
    const quizMatch = text.match(quizRegex);
    const quiz = quizMatch ? quizMatch[1] : "quiz none";

    console.log("\n🔥", text);
    console.log("\n🔥", answer);
    console.log("\n🔥", quiz);

    res.status(200).json({ message: "llm model router test", text, answer, quiz });
  } catch (e) {
    next(e);
  }
};

export const handleChatWithFree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chain = await chainInitializer({ free: true });
    const { user, sessionId } = req.body;
    if (!user || !sessionId) return res.status(400).json({ message: "incorrect LLM data" });
    let context = JSON.parse(await redisClient.get(sessionId));
    if (!context) context = [];

    let chat = { id: context.length + 1, human: user, ai: "" };
    context.push(chat);
    console.log("콘텍스트", context);

    const result = await chain.call({ user: JSON.stringify(context) });
    const { text } = result;
    context[context.length - 1]["ai"] = text;
    console.log("콘텍스트2", context);
    redisClient.set(sessionId, JSON.stringify(context));
    res.status(200).json({ message: "테스트 중", text });
  } catch (e) {
    next(e);
  }
};
