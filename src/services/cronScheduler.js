import cron from "node-cron";
import Log from "../utils/log.js";
import LogHandler from "../crons/removeOldLogs.js";
import deleteRemovedGuilds from "../crons/deleteRemovedGuilds.js";

const scheduleCrons = async function(client){
    // daily cron
    cron.schedule("0 0 * * *", async() => {
        await deleteRemovedGuilds(client);
        await LogHandler.removeOldLogs();
    });

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");

    // start jobs on init
    await LogHandler.removeOldLogs();
    await deleteRemovedGuilds(client);
};

export default scheduleCrons;