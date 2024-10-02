import { v4 } from "uuid";
import { DEFAULT_LANGUAGE } from ".";

type UserData = { username: string; language: string };

//2 Maps allow us to keep it at O(1) speed.
const usersByTokensMap = new Map<string, UserData>();
const tokenByUsernamesMap = new Map<string, string>();

export function userHandler(username: string, language?: string) {
  const existingToken = tokenByUsernamesMap.get(username);
  if (!existingToken) {
    const token = v4();
    usersByTokensMap.set(token, {
      username,
      language: language || DEFAULT_LANGUAGE,
    });
    tokenByUsernamesMap.set(username, token);
    return token;
  }

  if (language) {
    usersByTokensMap.set(existingToken, { username, language });
  }

  return existingToken;
}

export function getLanguageByToken(token: string) {
  const user = usersByTokensMap.get(token);
  return user?.language;
}
