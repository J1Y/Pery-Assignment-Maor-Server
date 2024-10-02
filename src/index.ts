import express from "express";
import { JSDOM } from "jsdom";
import { userHandler, getLanguageByToken } from "./signupHandler";
import {
  articleNameValidationSchema,
  tokenValidationSchema,
  userValidationSchema,
} from "./validations";
import { fetchWithCache } from "./fetchCache";

//I think having this variable as a const and not as an environment variable make more sense, as this is very unlikely to change
export const DEFAULT_LANGUAGE = "en";

const app = express();
app.use(express.json());

app.get("/introduction/:articleName", async (req, res) => {
  const { articleName } = req.params;

  const { error: tokenError } = tokenValidationSchema.validate(
    req.headers["x-authentication"]
  );
  if (tokenError) {
    res.status(400).json({
      tokenError,
    });
    return;
  }

  const token = req.headers["x-authentication"] as string | undefined;
  const languageByToken = token ? getLanguageByToken(token) : null;

  if (token && !languageByToken) {
    res.status(500).json({
      error: "Something went wrong. it is possible that the token is invalid",
    });
    return;
  }

  const language =
    languageByToken || req.headers["accept-language"] || DEFAULT_LANGUAGE;

  const { error } = articleNameValidationSchema.validate(articleName);
  if (error) {
    res.status(400).json({
      error:
        "You may only input article names that are comprised of letters, hyphens (-), underscores (_) and numbers",
    });
    return;
  }

  try {
    const { response, unixFetchTime } = await fetchWithCache(
      `https://${language}.wikipedia.org/wiki/${articleName}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        res.status(404).json({
          error: "The article not found",
        });
        return;
      } else {
        res.status(500).json({
          error: "Something went wrong",
        });
        return;
      }
    }

    const html = await response.text();
    const dom = new JSDOM(html);

    //Note: it works for every article I tested it with. however, in a real project I would not do it like this as this is not future proof, changes to the site can break it.
    const firstParagraph = Array.from(
      dom.window.document
        .getElementById("mw-content-text")
        ?.querySelector("div")?.children || []
    ).filter((child) => child.tagName === "P" && !child.id)[1]?.textContent;

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
    return;
  }
});

app.post("/user", (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const { userName, language } = req.body;
  const token = userHandler(userName, language);

  if (!token) {
    res.status(500).json({ error: "Something went wrong" });
  }

  res.send(token);
});

app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`);
});
