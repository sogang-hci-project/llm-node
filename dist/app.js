"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./constants");
const routers_1 = require("./routers");
const app = (0, express_1.default)();
app.set("port", 5000);
if (constants_1.isProd) {
    app.use((0, morgan_1.default)("combined"));
}
else {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routers_1.LLMRouter);
app.use((error, req, res, next) => {
    console.error(error);
    res.status(210).json({ message: "LLM 서버 내부 오류가 발생했습니다.", error });
    next();
});
app.listen(app.get("port"), () => {
    console.log(`listening on http://localhost:${app.get("port")}`);
});
