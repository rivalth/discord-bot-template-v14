
import mongoose from 'mongoose';

let Schema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true, default: 0 }
}, { timestamps: true, versionKey: false });
let CommandStats = mongoose.model('CommandStats', Schema);

export default CommandStats;