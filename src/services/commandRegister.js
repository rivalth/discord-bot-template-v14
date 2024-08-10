import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Collection, REST, Routes } from "discord.js";
import Log from "../utils/log.js";

const commandRegister = async function(client){
    client.commands = new Collection();
    const foldersPath = path.resolve("src", "commands");
    const commandFolders = await fs.readdir(foldersPath);

    for (const folder of commandFolders){
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith(".js"));

        for (const file of commandFiles){
            const filePath = path.join(commandsPath, file);
            const prefix = os.platform() === "win32" ? "file://" : "";
            const command = (await import(prefix + filePath)).default;

            if ("data" in command && "execute" in command){
                client.commands.set(command.data.name, command);
            }
            else {
                Log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        Log.done(`Registered ${commandFiles.length} commands in ${folder}.`);
    }

    const rest = new REST().setToken(client.token || "");
    const cmdMap = client.commands.map(command => command.data.toJSON());
    try {
        Log.info("Started refreshing application (/) commands.");
        const data = await rest.put(Routes.applicationCommands(client.user?.id || ""), {
            body: cmdMap,
        });
        Log.done("Successfully reloaded " + /** @type {Array} */ (data).length + " application (/) commands.");
    }
    catch (error){
        Log.error("Error during registering of application (/) commands: " + error);
    }

    /**
     * @info: send cmdMap to bot lists here
     */

    return client.commands;
};

export default commandRegister;