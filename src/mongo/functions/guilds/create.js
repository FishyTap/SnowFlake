const { Client } = require("discord.js");
const schema = require("../../schemas/guilds");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @returns
	 */
	create: async (client, id) => {
		let data = await schema.findOne({ guildId: id }).catch(() => {});

		if (!data) {
			data = await schema.create({ guildId: id });
			await data.save();
		}

		return data;
	}
};
