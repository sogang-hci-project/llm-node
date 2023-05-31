import { NextFunction, Request, Response } from "express";

import { chainInitializer, dbTemplate, dbTemplateDone, dbTemplateNoQuiz, dbTemplateQA, redisClient } from "~/lib";

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, sessionID, additional, done } = req.body;

    if (!user || !sessionID) return res.status(400).json({ message: "incorrect LLM data" });
    let context = JSON.parse(await redisClient.get(sessionID));
    if (!context) context = [];
    const chat = { id: context.length + 1, human: user, ai: "" };
    context.push(chat);

    let query;
    if (done) {
      query = `${additional ? dbTemplateQA : dbTemplateDone}\n${JSON.stringify(context)}`;
    } else {
      query = `${additional ? dbTemplate : dbTemplateNoQuiz}\n${JSON.stringify(context)}`;
    }

    const chain = await chainInitializer({ free: false });
    const result = await chain.call({
      query,
    });
    const { text } = result;
    context[context.length - 1]["ai"] = text;
    await redisClient.set(sessionID, JSON.stringify(context));

    // 정규식을 사용하여 Answer: 뒤에 있는 문장 추출
    const answerRegex = /Answer:\s*(.*)/;
    const answerMatch = text.match(answerRegex);
    const answer = answerMatch && answerMatch[1];

    // 정규식을 사용하여 Quiz: 뒤에 있는 문장 추출
    const quizRegex = /Quiz:\s*(.*)/;
    const quizMatch = text.match(quizRegex);
    const quiz = quizMatch && quizMatch[1];

    res.status(200).json({ message: "llm model router test", text, answer, quiz });
  } catch (e) {
    next(e);
  }
};

export const handleChatWithFree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chain = await chainInitializer({ free: true });
    const { user, sessionID } = req.body;
    if (!user || !sessionID) return res.status(400).json({ message: "incorrect LLM data" });
    let context = JSON.parse(await redisClient.get(sessionID));
    if (!context) context = [];

    let chat = { id: context.length + 1, human: user, ai: "" };
    context.push(chat);

    const result = await chain.call({ user: JSON.stringify(context) });
    const { text } = result;

    context[context.length - 1]["ai"] = text;

    await redisClient.set(sessionID, JSON.stringify(context));
    res.status(200).json({ message: "Free model connect success", text });
  } catch (e) {
    next(e);
  }
};
