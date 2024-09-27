import inquirer from "inquirer";
import schedule from "node-schedule";
import game from "./controllers/game.js";
import logger from "./utils/logger.js";

async function mainMenu() {
    console.clear();

    console.log(
        "Join t.me/erdropawam and t.me/erdropkosong for get access key"
    );
    console.log("DO WITH YOUR OWN RISK !!!\n");

    const choices = [
        "Manual",
        "Auto",
        new inquirer.Separator(),
        "Exit",
        new inquirer.Separator(),
    ];

    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "menuOption",
            message: "Pilihan:",
            choices,
        },
    ]);

    switch (answer.menuOption) {
        case "Manual":
            await game.play();
            await mainMenu();
            break;
        case "Auto":
            const startTime = Date.now();
            const job = schedule.scheduleJob(
                new Date(startTime + 1 * 60 * 60 * 1000),
                async function () {
                    await game.play();
                    logger.info("[system] next run in 1 hour");
                    job.reschedule(
                        new Date(
                            startTime +
                                (Date.now() - startTime) +
                                1 * 60 * 60 * 1000
                        )
                    );
                }
            );
            job.invoke();
            break;
        case "Exit":
            process.exit(1);
    }
}

mainMenu();
