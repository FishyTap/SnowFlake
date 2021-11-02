const mongoose = require("mongoose");

const schema = mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	music: {
		playlist: {
			type: [String],
			default: null
		}
	}
});

module.exports = mongoose.model("users", schema);
