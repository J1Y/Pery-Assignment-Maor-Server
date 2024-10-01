"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
console.log("in app");
app.get("/", (req, res) => {
    console.log("in get");
    res.send("hello world!");
});
app.listen(3000, () => {
    console.log(`listening at port ${3000}`);
});
