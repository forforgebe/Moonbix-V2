import queryString from "querystring";
import { userAgents } from "./file.js";

export function setDelay(s) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export function extractUsernameFromTgHash(hash) {
    try {
        const parsedQuery = queryString.parse(hash);
        const userParsed = JSON.parse(parsedQuery.user);
        return userParsed.username;
    } catch (err) {
        throw err;
    }
}

export function extractIdFromTgHash(hash) {
    try {
        const parsedQuery = queryString.parse(hash);
        const userParsed = JSON.parse(parsedQuery.user);
        return userParsed.id;
    } catch (err) {
        throw err;
    }
}

export function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}
