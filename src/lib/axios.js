import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false,
});

class Instance {
    constructor() {
        this.instance = axios.create({
            headers: {
                Lang: "en",
                "Content-Type": "application/json",
                "Bnc-Location": "",
                "X-Passthrough-Token": "",
                Clienttype: "web",
                Origin: "https://www.binance.com",
                Referer: "https://www.binance.com/en/game/tg/moon-bix",
                "Sec-Ch-Ua-Platform": "Android",
                "X-Requested-With": "org.telegram.messenger",
            },
            timeout: 20000,
            httpsAgent: agent,
        });
    }

    getInstance() {
        return this.instance;
    }
}

const Axios = new Instance();
export default Axios;
