const schema = require("../schemas/guilds");

module.exports = {
	customPrefix: async (message) => {
		let custom;

		const data = await schema
			.findOne({ guildId: message.guild.id })
			.catch(() => {});

		if (data) {
			custom = data.prefix;
		} else {
			custom = process.env.PREFIX;
		}

		return custom;
	}
};
