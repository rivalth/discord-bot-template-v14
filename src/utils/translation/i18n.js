import path from "node:path";
import i18n from "i18n-light";
import GuildModel from "../../models/Guild.js";

i18n.configure({
    defaultLocale: "en",
    dir: path.resolve("./locales"),
    extension: ".json",
});

const __ = (...args) => async(guild, quantisize = false) => {
    const locale = (await GuildModel.findOne({ id: guild }).lean().select("language"))?.language|| 'en'; //(await db.get(`guild-${guild}.locale`)) || "English_en";
    i18n.setLocale(locale);

    let result = quantisize ? i18n.__n(...args) : i18n.__(...args);
    if (!result){
        i18n.setLocale("en");
        result = quantisize ? i18n.__n(...args) : i18n.__(...args);
    }

    return result;
};

export default __;