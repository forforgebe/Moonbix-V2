import { Main, Auth, Game } from "./main.js";
import {
    setDelay,
    extractIdFromTgHash,
    extractUsernameFromTgHash,
    getRandomUserAgent,
} from "../utils/helpers.js";
import { tgHashes } from "../utils/file.js";
import { app } from "../config.js";
import { PromisePool } from "@supercharge/promise-pool";
import logger from "../utils/logger.js";

class gameController {
    constructor() {
        this.batchWorker = app.turboMode === true ? 2 : 1;
        this.totalPoints = 0;
    }

    async play() {
        const { results, errors } = await PromisePool.withConcurrency(
            this.batchWorker
        )
            .for(tgHashes)
            .process(async (list, index, pool) => {
                const username = extractIdFromTgHash(list);
                const id = extractUsernameFromTgHash(list);

                Main.setUa(getRandomUserAgent());

                try {
                    const login = await Auth.login(list);
                    if (!login) return;

                    const jwt = login.data.accessToken;

                    logger.info(`[${username}] user authenticated -> ${id}`);

                    const getInfo = await Auth.info(jwt);
                    if (!getInfo) return;

                    if (!getInfo.data?.qualified) {
                        logger.warn(
                            `[${username}] user is not qualified or banned (skipped)`
                        );

                        if (
                            (app.antiDetect === null ||
                                typeof app.antiDetect !== "boolean") &&
                            app.antiDetect
                                ? true
                                : false
                        ) {
                            if (index == 0) {
                                logger.warn(
                                    `[system] trigger is activated to prevent all accounts get detected (if you see this it may your first account is banned)`
                                );
                                logger.warn(
                                    `[system] you must remove first account if it is banned account or try to disable this feature`
                                );

                                process.exit(1);
                            }
                        }

                        return;
                    }

                    const ticketLeft =
                        Number(getInfo.data?.metaInfo?.totalAttempts) -
                        Number(getInfo.data?.metaInfo?.consumedAttempts);

                    const balance = Number(
                        getInfo.data?.metaInfo?.totalGrade
                    ).toLocaleString("en-US");

                    this.totalPoints += getInfo.data?.metaInfo?.totalGrade;

                    if (ticketLeft > 0) {
                        logger.info(
                            `[${username}] get info: ${balance} pts (${ticketLeft} tickets left)`
                        );
                    } else {
                        logger.warn(
                            `[${username}] get info: ${balance} pts (${ticketLeft} tickets left) -> game cancelled`
                        );

                        return;
                    }

                    if (!app.key && app.key === "") {
                        logger.error(
                            `[system] process terminated due to key is not set yet`
                        );
                        process.exit(1);
                    }

                    await setDelay(2);

                    let isServerOkay = false;

                    while (!isServerOkay) {
                        const isMaintenance = await Game.getStatusServer();
                        if (isMaintenance && isMaintenance.data.status === 0) {
                            logger.warn(
                                `[system] under maintenance, try again later`
                            );
                            await setDelay(600);
                        } else {
                            isServerOkay = true;
                        }
                    }

                    const tickets = new Array(ticketLeft);

                    const { results, errors } =
                        await PromisePool.withConcurrency(1)
                            .for(tickets)
                            .process(async (list, index, pool) => {
                                await setDelay(5);

                                const startGame = await Game.doPlayGame(jwt);
                                if (!startGame) return;

                                logger.info(
                                    `[${username}] game "${
                                        startGame?.data?.gameTag
                                    }" started (please wait ${
                                        app.turboMode ? 10 : 45
                                    } seconds)`
                                );

                                const startTime = Date.now();

                                const payloadResponse = await Game.getPayload(
                                    app.key,
                                    startGame,
                                    app.turboMode,
                                    app.maxScore
                                );

                                await setDelay(2);

                                const stopTime = Date.now();

                                if (!app.turboMode) {
                                    const executionTime = stopTime - startTime;

                                    if (executionTime < 45000) {
                                        const additionalDelay =
                                            45000 - executionTime;
                                        await setDelay(additionalDelay / 1000);
                                    }
                                } else {
                                    await setDelay(10);
                                }

                                if (!payloadResponse) return;

                                const stopGame = await Game.doFinishGame(
                                    jwt,
                                    payloadResponse.data.payload,
                                    payloadResponse.data.score
                                );

                                if (!stopGame) return;

                                logger.info(
                                    `[${username}] game "${
                                        startGame.data?.gameTag
                                    }" finished +${
                                        payloadResponse.data?.score
                                    } pts [${index + 1}/${ticketLeft}]`
                                );

                                const fetchInfo = await Auth.info(jwt);
                                if (!fetchInfo) return;

                                this.totalPoints += payloadResponse.data?.score;

                                if (!fetchInfo.data?.qualified) {
                                    if (app.antiDetect) {
                                        logger.warn(
                                            `[system] process terminated due to trigger anti banned is activated `
                                        );

                                        process.exit(1);
                                    }
                                }

                                await setDelay(5);
                            });
                    await setDelay(1);
                } catch (err) {
                    await setDelay(3);
                    if (err?.message.includes("'accessToken'")) {
                        err.message =
                            "connection error or invalid tg_hash (turn on your vpn or check if your query is valid)";
                    }
                    logger.error(
                        `[${username}] ${err.message ? err.message : err}`
                    );
                }
            });

        logger.info(
            `[system] total -> ${this.totalPoints.toLocaleString(
                "en-US"
            )} pts from ${
                tgHashes.length
            } accounts (excluded from banned account)`
        );
    }
}

const game = new gameController();

export default game;
