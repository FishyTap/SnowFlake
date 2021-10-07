const mongoose = require("mongoose");

const schema = mongoose.Schema({
	guildId: {
		type: String,
		required: true
	},
	prefix: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("guilds", schema);
