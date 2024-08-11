import os from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../utils/translation/i18n.js";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription(translations.info.desc)
        .setDescriptionLocalizations(translations.info.translations)
        .setDMPermission(false),

    async execute(interaction){
        const count = interaction.guild?.memberCount || "N/A";
        const boosts = interaction.guild?.premiumSubscriptionCount || "N/A";
        const RamInUseMB = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024);
        const RamTotalGB = Math.floor(os.totalmem() / 1024 / 1024 / 1024);

        const created = interaction.guild?.createdAt.toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) || "N/A";

        const guildOwner = interaction.guild?.ownerId;
        let owner = "N/A";
        if (guildOwner) owner = (await interaction.client.users.fetch(guildOwner)).tag;

        const promises = [
            interaction.client.cluster?.fetchClientValues("guilds.cache.size"), 
            interaction.client.cluster?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        const shardCount = interaction.client.cluster.info.TOTAL_SHARDS || 1;
        const isBotVerified = interaction.client.user?.flags?.has("VerifiedBot") || false;

        const [guilds, members] = await Promise.all(promises);
        const totalGuilds = guilds?.reduce((acc, guildCount) => Number(acc) + Number(guildCount), 0);
        const totalMembers = members?.reduce((acc, memberCount) => Number(acc) + Number(memberCount), 0);

        const botAvatar = interaction.client.user?.displayAvatarURL({ dynamic: true }) || global.config.bot.fallbackImageUrl;

        const embed = new EmbedBuilder()
        .setTitle("Bot Info")
        .setDescription(await __("replies.info.tagLine")(interaction.guild.id))
        .setColor(2518621)
        .setThumbnail(botAvatar)
        .setFields(
            { name: "Author :computer:", value: "Rivalth", inline: true, },
            { name: "Source Code :scroll:", value: "[Rivalth/discord-bot-template-v14](https://github.com/rivalth/discord-bot-template-v14)",inline: true, },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Programming Language :wrench:", value: `NodeJS ${process.version}`, inline: true, },
            { name: "Server OS :pager:", value: `${os.type()} ${os.release()} ${os.arch()}`, inline: true, },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Meta :bar_chart:", value: `PID: \`${process.pid}\`\nUptime: \`${process.uptime().toFixed(4)}s\`\nSystem CPU Time: \`${process.cpuUsage().system}\`\nUser CPU Time: \`${process.cpuUsage().system}\`\nRam Usage: \`${RamInUseMB}MB / ${RamTotalGB}GB\`\nShard Count: \`${shardCount}\`\nBot Verified: \`${isBotVerified}\``, inline: true, },
            { name: "Guild :clipboard:", value: `User: \`${count}\`\nBoosts: \`${boosts}\`\nCreated: \`${created}\`\nOwner: \`${owner}\`\nGuild Lang: \`${await __("__LANG__")(interaction.guild.id)}\`\nServer count: \`${totalGuilds}\`\nMember count: \`${totalMembers}\``, inline: true, },
            { name: "\u200b", value: "\u200b", inline: true },
        )

        return await interaction.reply({ embeds: [embed] });
    },
};