const { Message } = require("discord.js");
const schema = require("../../schemas/guilds");

module.exports = {
	/**
	 *
	 * @param {Message} message
	 * @returns
	 */
	customPrefix: async (message) => {
		let custom;

		const data = await schema
			.findOne({ guildId: message.guild.id })
			.catch(() => {});

		if (data) {
			custom = data?.config?.prefix;
		} else {
			custom = process.env.PREFIX;
		}

		return custom;
	}
};
