import Log from "../utils/log.js";
import __ from "../utils/translation/i18n.js";

const handleCommandInteraction = async function(interaction){
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command){
        Log.warn(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: await __("errors.command_not_found", interaction.commandName)(interaction.guildId), ephemeral: true });
        return;
    }

    try {
        // await statDb.add(interaction.commandName, 1);
        await command.execute(interaction);
    } catch (error) {
        Log.error("Error during command execution: ", error);
        const content = await __("errors.generic_command_execution_failed")(interaction.guildId);
        if (interaction.replied || interaction.deferred) await interaction.followUp({ content, ephemeral: true });
        else await interaction.reply({ content, ephemeral: true });
    }
};

const interactionCreateHandler = async function(interaction){
    if (interaction.isChatInputCommand()) await handleCommandInteraction(interaction);
};

export default interactionCreateHandler;