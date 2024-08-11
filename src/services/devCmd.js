import path from "node:path";
import { config } from "../utils/config.js";
import Log from "../utils/log.js";
import CommandStats from "../models/Stats.js";

// Dev-only debug stuff

const devCmd = async function(message){
    if (!config.discord.developers.includes(message.author.id)) return;

    const cont = message.content;

    if (cont.toLowerCase().startsWith(".cmdstats")){
        try {
            const s = await CommandStats.find().lean().sort({ value: -1 });
            const m = s.map(({ name, value }) => `${name}: ${value}`).join("\n");
            if (!m){
                await message.channel.send("No stats available.");
                return;
            }
            await message.channel.send(m);
        }
        catch (e){
            Log.error(e);
        }
    }
};

export default devCmd;