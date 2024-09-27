import Api from "../core/requestHandler.js";
import { setDelay } from "../utils/helpers.js";
import { app } from "../config.js";
import logger from "../utils/logger.js";

class Main {
    static setUa(ua) {
        Api.setUserAgent(ua);
    }

    static async retryOperation(
        operation,
        params,
        retries = app.maxRetry > 1 ? app.maxRetry : 10
    ) {
        for (let i = 0; i < retries; i++) {
            try {
                const data = await operation(...params);
                if (data) {
                    return data;
                }
            } catch (err) {
                // debug
                // console.log(err);

                // error message from pemulung api
                if (err?.errMessage?.error) {
                    if (err.errMessage.error == "Key is not authorized") {
                        err.errMessage.error =
                            "You are not using valid key. Join group @erdropkosong for get your key";
                    } else if (err.errMessage.error == "Missing key") {
                        err.errMessage.error = "Key is not set yet";
                    }
                    retries = 0;
                }

                logger.error(
                    `${operation.name} - ${
                        err.errMessage?.error
                            ? err.errMessage.error
                            : err.errMessage
                            ? JSON.stringify(err.errMessage)
                            : err
                            ? err.status
                            : "something wrong"
                    }`
                );

                // others
                if (i === retries - 1) {
                    throw new Error(
                        `${operation?.name} - ${err?.errMessage?.message}`
                    );
                }
                await setDelay(2);
            }
        }
    }
}

class Auth {
    static async login(hash) {
        try {
            if (!hash) {
                throw new Error("Invalid hash parameter");
            }
            Api.setHash(hash);
            return Main.retryOperation(Api.auth, []);
        } catch (err) {
            throw err;
        }
    }

    static async info(jwt) {
        try {
            if (!jwt) {
                throw new Error("Invalid jwt parameter");
            }
            Api.setJwt(jwt);
            return Main.retryOperation(Api.fetchInfo, []);
        } catch (err) {
            throw err;
        }
    }
}

class Game {
    static async getPayload(user, gameData, isTurbo, isMaxScore) {
        try {
            if (!user || !gameData) {
                throw new Error("Invalid user or gameData parameter");
            }
            Api.setUser(user);
            Api.setGameData(gameData);
            Api.setIsTurbo(isTurbo);
            Api.setIsMaxScore(isMaxScore);
            return Main.retryOperation(Api.fetchPayload, []);
        } catch (err) {
            throw err;
        }
    }

    static async getStatusServer() {
        try {
            return Main.retryOperation(Api.fetchInfoServer, []);
        } catch (err) {
            throw err;
        }
    }

    static async doPlayGame(jwt) {
        try {
            if (!jwt) {
                throw new Error("Invalid jwt parameter");
            }
            Api.setJwt(jwt);
            return Main.retryOperation(Api.startGame, []);
        } catch (err) {
            throw err;
        }
    }

    static async doFinishGame(jwt, payload, points) {
        try {
            if (!jwt || !payload || !points) {
                throw new Error("Invalid jwt, payload, points parameter");
            }

            Api.setJwt(jwt);
            Api.setPayload(payload);
            Api.setPoints(points);
            return Main.retryOperation(Api.endGame, []);
        } catch (err) {
            throw err;
        }
    }
}

export { Main, Auth, Game };
