const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "snipe",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_MESSAGES"],
	usage: "<optional: index>",
	description: "Shows deleted messages",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		try {
			const snipes = client.snipes.get(message.channel.id);

			if (!snipes) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Currently there are no deleted messages in this channel**"
							)
					]
				});
			}

			const snipe = args[0] - 1 || 0;

			const target = snipes[snipe];

			if (snipe + 1 > snipes.length) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**There aren't that many messages**`
							)
					]
				});
			} else if (snipe + 1 <= 0) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**There aren't that less messages**`
							)
					]
				});
			}

			const { msg, attachments, timestamps } = target;

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setAuthor(
							msg.author.tag,
							msg.author.displayAvatarURL()
						)
						.setImage(attachments)
						.setDescription(
							[
								`**Message:** **\`${snipe + 1} / ${
									snipes.length
								}\`**  **|**  **Timestamp:** **\`${moment(
									timestamps
								).fromNow()}\`**`,
								`**---------------------------------------------------------------------------------**`,
								`${msg.content}`
							].join("\n")
						)
				]
			});
		} catch {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}
	}
};
