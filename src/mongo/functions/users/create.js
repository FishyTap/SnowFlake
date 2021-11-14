const { Client } = require("discord.js");
const schema = require("../../schemas/users");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @returns
	 */
	create: async (client, id) => {
		let data = await schema.findOne({ userId: id }).catch(() => {});

		if (!data) {
			data = await schema.create({ userId: id });

			await data.music.playlist.splice(0, 1);

			await data.save();
		}

		return data;
	}
};
