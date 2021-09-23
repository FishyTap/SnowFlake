const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	aliases: [],
	cooldown: 10,
	permissions: [],
	usage: "<none>",
	description: "Shows the current Ping Latency of the bot",
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		message.channel
			.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**🏓 Pong! | Calculating ping...**`)
				]
			})
			.then(async (msg) => {
				setTimeout(() => {
					msg.edit({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`**🏓 Pong! | Latency: ${
										msg.createdTimestamp -
										message.createdTimestamp
									}ms**`
								)
						]
					});
				}, 3000);
			})
			.catch(() => {
				return;
			});
	}
};
