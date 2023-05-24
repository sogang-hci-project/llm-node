"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_STORE_PATH = void 0;
const path_1 = __importDefault(require("path"));
const __dirname = path_1.default.resolve();
exports.DATA_STORE_PATH = `${__dirname}/../data_store`;
