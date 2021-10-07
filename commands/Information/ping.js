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
							.setTitle("🏓 Pong!").setDescription(`
								**Client Latency:  \`${msg.createdTimestamp - message.createdTimestamp}ms\`**
								**Api Latency:  \`${client.ws.ping}ms\`**
							`)
					]
				});
			})
			.catch(() => {});
	}
};
