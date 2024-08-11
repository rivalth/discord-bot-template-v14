import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../utils/translation/i18n.js";

export default {
    data: new SlashCommandBuilder()
        .setName("COMMAND_NAME")
        .setDescription(translations.COMMAND_NAME.desc)
        .setDescriptionLocalizations(translations.COMMAND_NAME.translations)
        .setDMPermission(false),

    async execute(interaction){
        // code goes here
    },
};