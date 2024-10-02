"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = exports.tokenValidationSchema = exports.articleNameValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.articleNameValidationSchema = joi_1.default.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .required();
exports.tokenValidationSchema = joi_1.default.string().optional().allow("");
exports.userValidationSchema = joi_1.default.object({
    userName: joi_1.default.string().required(),
    language: joi_1.default.string().optional().allow(""),
});
