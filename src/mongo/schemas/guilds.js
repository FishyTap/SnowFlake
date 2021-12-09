const mongoose = require("mongoose");

const schema = mongoose.Schema({
	guildId: {
		type: String,
		required: true
	},
	config: {
		prefix: {
			type: String,
			required: false
		}
	},
	features: {
		autoTranslate: {
			type: String,
			default: "false"
		}
	}
});

module.exports = mongoose.model("guilds", schema);
