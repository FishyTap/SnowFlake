const { Client, Message, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
	name: "djs",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<query>",
	description: "Fetches a specific discord.js document",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must state a query**")
				]
			});
		}

		let query = args.join(" ");

		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
			query
		)}`;

		axios.get(url).then(({ data }) => {
			if (data) {
				message.channel.send({ embeds: [data] });
			} else {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Unable to fetch anything with the given query**"
							)
					]
				});
			}
		});
	}
};
