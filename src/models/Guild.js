
import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    language: { type: String, required: true, default: "en"}
}, { timestamps: true, versionKey: false });
let GuildModel = mongoose.model('Guilds', Schema);

export default GuildModel;