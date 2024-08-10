import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { GatewayIntentBits, Events, ActivityType, Partials } from "discord.js";
import Log from "./utils/log.js";
import { config } from "./utils/config.js";
import DiscordClient from "./utils/client/index.js";
import registerCommands from "./services/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import scheduleCrons from "./services/cronScheduler.js";
import messageCreate from "./events/messageCreate.js";

import 'dotenv/config'

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: "Starting...", type: ActivityType.Playing }],
    },
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
});

Log.wait("Starting bot...");

client.cluster = new ClusterClient(client);

client.on(Events.ClientReady, async() => {
    Log.done("Client is ready!");

    const guildCount = await client.guilds.fetch().then(guilds => guilds.size);
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + guildCount + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    await scheduleCrons(client);

    client.user?.setActivity({ name: `Watching ${guildCount} servers!`, type: ActivityType.Playing });

    // Reload guild count every 5 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuildCount = await client.guilds.fetch().then(guilds => guilds.size);
        const statusHasReset = client.user?.presence.activities[0].name === "Starting...";

        if (newGuildCount !== lastGuildCount || statusHasReset){
            lastGuildCount = newGuildCount;
            client.user?.setActivity({ name: `Watching ${newGuildCount} servers!`, type: ActivityType.Playing });
            Log.info("Guild count changed to " + newGuildCount + ". Updated activity.");

            if (statusHasReset) Log.warn("Shard probably died. Re-Setting status without posting stats.");
        }
    }, 5 * 60 * 1000);

    client.user?.setStatus("online");
});

client.on(Events.MessageCreate, async message => messageCreate(message));

// eslint-disable-next-line no-unused-vars
client.on(Events.MessageDelete, async message => {});

client.on(Events.GuildCreate, guild => Log.info("Joined guild: " + guild.name));

client.on(Events.GuildDelete, guild => Log.info("Left guild: " + guild.name));

client.on(Events.GuildUnavailable, guild => Log.warn("Guild is unavailable: " + guild.name));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(process.env.APPLICATION_TOKEN)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

process.on("unhandledRejection", () => Log.error("Unhandled promise rejection: ", err));