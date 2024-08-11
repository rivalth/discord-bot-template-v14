import fs from "node:fs/promises";
import Log from "../utils/log.js";

const isObject = item => item && typeof item === "object" && !Array.isArray(item);

const deepMerge = function(target, source){
    if (isObject(target) && isObject(source)){
        for (const key in source){
            if (isObject(source[key])){
                if (!target[key]) target[key] = {};
                deepMerge(target[key], source[key]);
            }
            else target[key] = source[key];
        }
    }
    return target;
};

try {
    await fs.access("./config.custom.js");
}
catch (error){
    Log.error("Config file not found. To create one, either copy 'config.template.js' and rename it to 'config.custom.js' or run 'npm run generate-config'.");
    process.exit(1);
}

try {
    await fs.access("./src/templates/config.template.js");
}
catch (error){
    Log.error("Config template file not found. This is needed to read default values. Please re-clone the repository.");
    process.exit(1);
}

const configCustom = (await import("../../config.custom.js")).default;
const configBase = (await import("../templates/config.template.js")).default;
const packageJSON = JSON.parse(await fs.readFile("./package.json", "utf-8"));

export const meta = {
    getVersion: () => packageJSON.version,
    getName: () => packageJSON.name,
    getAuthor: () => packageJSON.author,
};

export const config = {
    ...deepMerge(
        configBase,
        configCustom,
    ),
};