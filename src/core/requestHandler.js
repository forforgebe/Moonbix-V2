import Axios from "../lib/axios.js";

class RequestHandler {
    constructor() {
        this.jwt = "";
        this.hash = "";
        this.gameId = "";
        this.points = 0;
        this.payload = "";
        this.userAgent = "";
        this.user = "";
        this.gameData = "";
        this.isTurbo = false;
        this.isMaxScore = false;
    }

    setJwt(jwt) {
        this.jwt = jwt;
    }

    setHash(hash) {
        this.hash = hash;
    }

    setPayload(payload) {
        this.payload = payload;
    }

    setPoints(points) {
        this.points = points;
    }

    setUserAgent(ua) {
        this.userAgent = ua;
    }

    setUser(user) {
        this.user = user;
    }

    setGameData(gameData) {
        this.gameData = gameData;
    }

    setIsTurbo(isTurbo) {
        this.isTurbo = isTurbo;
    }

    setIsMaxScore(isMaxScore) {
        this.isMaxScore = isMaxScore;
    }

    async makeRequest(
        endpoint,
        method = "GET",
        data = null,
        baseURL = "https://www.binance.com",
        additionalHeaders = {}
    ) {
        try {
            const defaultHeaders = {
                "User-Agent": this.userAgent,
            };

            let options = {
                url: endpoint,
                method: method,
                data: data,
                baseURL: baseURL,
                headers: { ...defaultHeaders, ...additionalHeaders },
            };

            const axiosInstance = Axios.getInstance();

            const response = await axiosInstance(options);
            return response.data;
        } catch (error) {
            const errData = {
                errCode: error?.response?.status || 500,
                errMessage: error?.response?.data
                    ? error.response.data
                    : error.message,
            };
            throw errData;
        }
    }

    async auth() {
        try {
            const data = {
                queryString: Api.hash,
                socialType: "telegram",
            };

            const request = await Api.makeRequest(
                "/bapi/growth/v1/friendly/growth-paas/third-party/access/accessToken",
                "POST",
                data,
                "https://www.binance.com",
                {}
            );

            return request;
        } catch (error) {
            throw error;
        }
    }

    async login() {
        try {
            const data = {
                queryString: Api.hash,
                socialType: "telegram",
            };

            const request = await Api.makeRequest(
                "/bapi/growth/v1/friendly/growth-paas/third-party/access/accessToken",
                "POST",
                data,
                "https://www.binance.com",
                {}
            );

            return request;
        } catch (error) {
            throw error;
        }
    }

    async fetchInfo() {
        try {
            const data = { resourceId: 2056 };
            const request = await Api.makeRequest(
                "/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/user/user-info",
                "POST",
                data,
                "https://www.binance.com",
                { "X-Growth-Token": `${Api.jwt}` }
            );
            return request;
        } catch (error) {
            throw error;
        }
    }

    async fetchPayload() {
        try {
            const data = {
                data: Api.gameData,
                isTurbo: Api.isTurbo,
                isMaxScore: Api.isMaxScore,
            };

            const request = await Api.makeRequest(
                `/api/payload`,
                "POST",
                data,
                "https://pemulung-moonbix.duckdns.org",
                { ["X-Pemulung"]: `${Api.user}` }
            );
            return request;
        } catch (error) {
            throw error;
        }
    }

    async fetchInfoServer() {
        try {
            const data = {};
            const request = await Api.makeRequest(
                `/api/status`,
                "GET",
                data,
                "https://pemulung-moonbix.duckdns.org",
                {}
            );
            return request;
        } catch (error) {
            throw error;
        }
    }

    async startGame() {
        try {
            const data = { resourceId: 2056 };
            const request = await Api.makeRequest(
                `/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/game/start`,
                "POST",
                data,
                "https://www.binance.com",
                { "X-Growth-Token": `${Api.jwt}` }
            );
            return request;
        } catch (error) {
            throw error;
        }
    }

    async endGame() {
        try {
            const data = {
                resourceId: 2056,
                payload: Api.payload,
                log: Api.points,
            };

            const request = await Api.makeRequest(
                `/bapi/growth/v1/friendly/growth-paas/mini-app-activity/third-party/game/complete`,
                "POST",
                data,
                "https://www.binance.com",
                { "X-Growth-Token": `${Api.jwt}` }
            );
            return request;
        } catch (error) {
            throw error;
        }
    }
}

const Api = new RequestHandler();
export default Api;
