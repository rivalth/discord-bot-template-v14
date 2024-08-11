
import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    guilds: { type: Array, default: [] }
}, { timestamps: true, versionKey: false });
let UserModel = mongoose.model('Users', Schema);

export default UserModel;