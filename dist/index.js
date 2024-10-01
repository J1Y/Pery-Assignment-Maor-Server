"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsdom_1 = require("jsdom");
const joi_1 = __importDefault(require("joi"));
const app = (0, express_1.default)();
const articleNameValidationSchema = joi_1.default.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .required();
app.get("/introduction/:articleName", async (req, res) => {
    const { articleName } = req.params;
    const language = req.headers["accept-language"] || "en";
    const { error } = articleNameValidationSchema.validate(articleName);
    if (error) {
        res.status(400).json({
            error: "You may only input article names that are comprised of letters, hyphens (-), underscores (_) and numbers",
        });
        return;
    }
    try {
        const response = await fetch(`https://${language}.wikipedia.org/wiki/${articleName}`);
        if (!response.ok) {
            if (response.status === 404) {
                res.status(404).json({
                    error: "The article not found",
                });
                return;
            }
            else {
                res.status(500).json({
                    error: "Something went wrong",
                });
                return;
            }
        }
        const html = await response.text();
        const dom = new jsdom_1.JSDOM(html);
        //Note: it works for every article I tested it with. however, in a real project I would not do it like this as this is not future proof, changes to the site can break it.
        const firstParagraph = Array.from(dom.window.document
            .getElementById("mw-content-text")
            ?.querySelector("div")?.children || []).filter((child) => child.tagName === "P" && !child.id)[1].textContent;
        if (!firstParagraph) {
            res.status(404).json({
                error: "Could not find the first paragraph of this article",
            });
            return;
        }
        res.json({
            scrapeDate: Date.now(),
            articleName,
            introduction: firstParagraph,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Something went wrong",
        });
        return;
    }
});
app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`);
});
