const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	aliases: [],
	cooldown: 10,
	permissions: [],
	usage: "",
	description: "Shows the current Ping Latency of the bot",
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let time = Date.now();

		message.channel
			.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Calculating ping...**`)
				]
			})
			.then(async (msg) => {
				msg.edit({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setAuthor(
								"🏓 Pong!",
								client.user.displayAvatarURL({ dynamic: true })
							)
							.addField(
								"**Client Latency**",
								`**\`\`\`ini\n   [ ${
									Date.now() - time
								}ms ]   \`\`\`**`,
								true
							)
							.addField(
								"**API Latency**",
								`**\`\`\`ini\n   [ ${client.ws.ping}ms ]   \`\`\`**`,
								true
							)
					]
				});
			})
			.catch(() => {});
	}
};
