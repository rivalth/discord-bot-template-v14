import Log from "../utils/log.js";

const iterator = async function(dbObj, dbname, client){
    let counter = 0;
    for (const guild of dbObj){
        const guildId = guild.id.replace("guild-", "");
        const discordGuild = await client.guilds.fetch(guildId).catch(() => null);

        if (!discordGuild){
            Log.warn(`[CRON] Removing guild ${guildId} from DB...`);
            if (dbname === "guild") await guildDb.delete(guild.id);
            if (dbname === "user") await userDb.delete(guild.id);
            ++counter;
            continue;    
        }
    }
    return counter;
};

const deleteRemovedGuilds = async(client) => {
    Log.wait("[CRON] Removing non-existant guilds from DB...");

    const removed1 = await iterator(await userDb.all(), "user", client);
    const removed2 = await iterator(await guildDb.all(), "guild", client);

    if (removed1 !== removed2) Log.warn("[CRON] Db Mismatch! Removed " + removed1 + " from user DB and " + removed2 + " from guild DB.");

    Log.done(`[CRON] Cleaned up DB. Removed ${removed1} guilds.`);
};

export default deleteRemovedGuilds;