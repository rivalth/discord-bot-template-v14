import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../utils/translation/i18n.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription(translations.help.desc)
        .setDescriptionLocalizations(translations.help.translations)
        .setDMPermission(false),

    async execute(interaction){
        const userCommands = interaction.client.commands.filter(cmd => cmd.data.default_member_permissions !== "8");

        const str = await Promise.all(userCommands.map(async(cmd) => {
            const serverLang = await __("__LANG__")(interaction.guildId);
            const desc = cmd.data.description_localizations?.[serverLang] || cmd.data.description;
            return `**/${cmd.data.name}** - ${desc}`;
        }));

        return await interaction.reply({
            content: str.join("\n"),
            ephemeral: true,
        });
    },
};