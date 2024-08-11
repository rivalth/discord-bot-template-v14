import GuildModel from "../models/Guild.js";
import UserModel from "../models/Users.js";
import Log from "../utils/log.js";

const iterator = async function(dbObj, dbname, client){
    let counter = 0;
    for (const guild of dbObj){
        const discordGuild = await client.guilds.fetch(guild.id).catch(() => null);

        if (!discordGuild){
            Log.warn(`[CRON] Removing guild ${guild.name}(${guild.id}) from DB...`);
            await GuildModel.findOneAndDelete({ id: guild.id });
            ++counter;
            continue;    
        }
    }
    return counter;
};

const deleteRemovedGuilds = async(client) => {
    Log.wait("[CRON] Removing non-existant guilds from DB...");
    const removed2 = await iterator(await GuildModel.find().select('id name').lean(), "guild", client);

    Log.done(`[CRON] Cleaned up DB. Removed ${removed2} guilds.`);
};

export default deleteRemovedGuilds;