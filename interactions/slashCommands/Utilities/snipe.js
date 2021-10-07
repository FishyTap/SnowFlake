const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "snipe",
	description: "Shows deleted messages",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "index",
			description: "the index of snipe you want to view",
			type: "NUMBER",
			required: false
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let index = interaction.options.getNumber("index");

			const snipes = client.snipes.get(interaction.channelId);

			if (!snipes) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Currently there are no deleted messages in this channel**"
							)
					]
				});
			}

			const snipe = index - 1 || 0;

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

			interaction.editReply({
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
			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**An Error Occured**`)
				]
			});
		}
	}
};
