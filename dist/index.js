"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LANGUAGE = void 0;
const express_1 = __importDefault(require("express"));
const jsdom_1 = require("jsdom");
const signupHandler_1 = require("./signupHandler");
const validations_1 = require("./validations");
const fetchCache_1 = require("./fetchCache");
//I think having this variable as a const and not as an environment variable make more sense, as this is very unlikely to change
exports.DEFAULT_LANGUAGE = "en";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/introduction/:articleName", async (req, res) => {
    const { articleName } = req.params;
    const { error: tokenError } = validations_1.tokenValidationSchema.validate(req.headers["x-authentication"]);
    if (tokenError) {
        res.status(400).json({
            tokenError,
        });
        return;
    }
    const token = req.headers["x-authentication"];
    const languageByToken = token ? (0, signupHandler_1.getLanguageByToken)(token) : null;
    if (token && !languageByToken) {
        res.status(500).json({
            error: "Something went wrong. it is possible that the token is invalid",
        });
        return;
    }
    const language = languageByToken || req.headers["accept-language"] || exports.DEFAULT_LANGUAGE;
    const { error } = validations_1.articleNameValidationSchema.validate(articleName);
    if (error) {
        res.status(400).json({
            error: "You may only input article names that are comprised of letters, hyphens (-), underscores (_) and numbers",
        });
        return;
    }
    try {
        const { response, unixFetchTime } = await (0, fetchCache_1.fetchWithCache)(`https://${language}.wikipedia.org/wiki/${articleName}`);
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
            ?.querySelector("div")?.children || []).filter((child) => child.tagName === "P" && !child.id)[1]?.textContent;
        if (!firstParagraph) {
            res.status(404).json({
                error: "Could not find the first paragraph of this article",
            });
            return;
        }
        res.json({
            scrapeDate: unixFetchTime,
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
app.post("/user", (req, res) => {
    const { error } = validations_1.userValidationSchema.validate(req.body);
    if (error) {
        res.status(400).json(error);
        return;
    }
    const { userName, language } = req.body;
    const token = (0, signupHandler_1.userHandler)(userName, language);
    if (!token) {
        res.status(500).json({ error: "Something went wrong" });
    }
    res.send(token);
});
app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`);
});
