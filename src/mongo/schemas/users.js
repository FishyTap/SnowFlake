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
	},
	economy: {
		wallet: {
			type: Number,
			default: 1000
		},
		bank: {
			type: Number,
			default: 0
		},
		daily: {
			type: Number,
			default: 0
		},
		monthly: {
			type: Number,
			default: 0
		}
	}
});

module.exports = mongoose.model("users", schema);
