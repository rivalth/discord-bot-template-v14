import path from "node:path";
import fs from "node:fs";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import GuildModel from "../../models/Guild.js";

const getLanguages = function(){
    const languages = fs.readdirSync(path.resolve("./locales"));

    return languages.filter((lang) => lang.endsWith(".json")).map((lang) => ({
        name: lang.split("_")[0].split(".")[0],
        value: lang.split(".")[0],
    }));
};

export default {
    data: new SlashCommandBuilder()
        .setName("set-language")
        .setDescription(translations.set_language.desc)
        .setDescriptionLocalizations(translations.set_language.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("language")
                .setDescription(translations.set_language.options.language.desc)
                .setDescriptionLocalizations(translations.set_language.options.language.translations)
                .setRequired(true)
                .addChoices(...getLanguages())),

    async execute(interaction){
        const lang = interaction.options.get("language");
        if (!lang) return await interaction.reply({ content: "Invalid language", ephemeral: true });

        await GuildModel.findOneAndUpdate(
            { id: interaction.guildId }, 
            { $set: { language: lang.value || "en" }
        }, { upsert: true });

        return await interaction.reply({ content: "Language set to: " + lang.value, ephemeral: true });
    },
};