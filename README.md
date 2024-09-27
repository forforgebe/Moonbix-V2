# Moonbix

Bot for Moonbix Telegram made by [Pemulung](https://t.me/erdropkosong)

## For Personal and Education Only !!!

### DWYOR!!!

## Prepare Your Hash

1. Get your telegram hash for Moonbix bot.
2. Decode it on https://www.urldecoder.org/
3. Copy result starts from `query_id` or `user` and it should ends at `hash`.
4. If the hash already decode and looks like below you can skip it.

**Example 1:**

```
query_id=AAE7ww8sAAAAADvDDywPhkYE&user=%7B%22id%22%3A712230523%2C%22first_name%22%3A%22agcbo%F0%9F%A6%B4%22%2C%22last_name%22%3A%22%F0%9F%A6%B4%22%2C%22username%22%3A%22goavcod%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726846235&hash=a914bcef77e85d3bd01bde0c6d2f547670e1be9411237c323a0354afd6b371ca
```

**Example 2:**

```
user=%7B%22id%22%3A712230523%2C%22first_name%22%3A%22agcbo%F0%9F%A6%B4%22%2C%22last_name%22%3A%22%F0%9F%A6%B4%22%2C%22username%22%3A%22goavcod%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726846235&hash=a914bcef77e85d3bd01bde0c6d2f547670e1be9411237c323a0354afd6b371ca
```

5.  Save it to `<path>/src/data/tg-hash.txt`

## Prepare Your User Agent

1. Find out the list of user agents for mobile (recommended) from Google.
2. Save it to `<path>/src/data/user-agents.txt`

**Example 1:**

```
Mozilla/5.0 (Linux; Android 10; SM-A705FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 10; CPH2023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Mobile Safari/537.36
```

## Installation

Requires [Node.js](https://nodejs.org/) v18+ to run.

Install the dependencies

```sh
cd moonbix
npm i
```

## Configs

Go to `<path>/src/config.js`
Instructions on how to fill them in the bot are linked below.

| Variable   | Value             | Description                                                                                    |
| ---------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| turboMode  | `true` or `false` | Enable fast mode (default set to `false`)                                                      |
| maxScore   | `true` or `false` | Always get maximum score when play (default set to `false`)                                    |
| antiDetect | `true` or `false` | Effective for auto play to prevent get caught by Moonbix while playing (default set to `true`) |
| maxRetry   | `10-20`           | Retry count when error occured                                                                 |
| key        | `access key`      | Access key for bot                                                                             |

> Note: `key` is required and need valid key to run this script. If you fill out it with incorrect key your score will not increase.

## Run

1. Make sure your connection is not blocked by Binance
2. Open terminal and type `npm start`

## Feature

-- Auto Play (Every 1 hour)
-- Manual
-- Multi Accounts
-- Turbo Mode (High Risk)

## How to get key (Free)

Join to group [Pemulung](https://t.me/erdropkosong) then ask admin for the key.

**Do Not Share your key to anynone !**
**Do Not Use for Commercial, F Yeah !**
