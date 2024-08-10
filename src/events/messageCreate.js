import devCmd from "../services/devCmd.js";

const messageCreate = async function(message){
    if (message.author.bot || message.system) return;

    if (!message.guild){
        await devCmd(message);
        return;
    }

    if (message.partial) return;

    // Do stuff ...
};

export default messageCreate;