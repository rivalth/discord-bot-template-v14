import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../utils/translation/i18n.js";

export default {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription(translations.avatar.desc)
        .setDescriptionLocalizations(translations.avatar.translations)
        .setDMPermission(false),

    async execute(interaction){
        interaction.reply({ content: 'test' });
    },
};