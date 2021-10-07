const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "purge",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_MESSAGES"],
	usage: "<amount>",
	description: "Purges a specific amount of messages",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args[0]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state an amount of messages you want to purge**"
						)
				]
			});
		}

		if (isNaN(args[0])) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Invalid Amount**")
				]
			});
		}

		const amount = args[0];

		await message.channel.bulkDelete(1, true);

		let msg = message.channel.messages.fetch({ limit: amount });

		let filtered = (await msg).filter(
			(m) => Date.now() - m.createdTimestamp < ms("14 days")
		);

		setTimeout(() => {
			message.channel.bulkDelete(filtered);
		}, 750);
	}
};
