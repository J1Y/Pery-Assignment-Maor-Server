"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandler = userHandler;
exports.getLanguageByToken = getLanguageByToken;
const uuid_1 = require("uuid");
const _1 = require(".");
//2 Maps allow us to keep it at O(1) speed.
const usersByTokensMap = new Map();
const tokenByUsernamesMap = new Map();
function userHandler(username, language) {
    const existingToken = tokenByUsernamesMap.get(username);
    if (!existingToken) {
        const token = (0, uuid_1.v4)();
        usersByTokensMap.set(token, {
            username,
            language: language || _1.DEFAULT_LANGUAGE,
        });
        tokenByUsernamesMap.set(username, token);
        return token;
    }
    if (language) {
        usersByTokensMap.set(existingToken, { username, language });
    }
    return existingToken;
}
function getLanguageByToken(token) {
    const user = usersByTokensMap.get(token);
    return user?.language;
}
