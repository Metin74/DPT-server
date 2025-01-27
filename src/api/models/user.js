const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onlineTimesSchema = mongoose.Schema({
	login: {type: Date, default: Date.now},
	logout: {type: Date, default: Date.now},
});

const userSchema = mongoose.Schema({
	publicKey: { type: String, unique: true, required: true },
	phrase: { type: String, unique: true, required: true },
	topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
	opinions: [{ type: Schema.Types.ObjectId, ref: "Opinion" }],
	dialogs: [{ type: Schema.Types.ObjectId, ref: "Dialog" }],
	signupTime: { type: Date, required: true },
	onlineTimes: [ onlineTimesSchema ],
});

exports.userModel = mongoose.model("User", userSchema);
