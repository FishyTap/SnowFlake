const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "uptime",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Shows the uptime of the client",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let seconds = Math.floor(message.client.uptime / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		let days = Math.floor(hours / 24);

		seconds %= 60;
		minutes %= 60;
		hours %= 24;

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						`**Uptime : \`${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds\`**`
					)
			]
		});
	}
};
