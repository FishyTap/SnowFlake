const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "purge",
	description: "Purges a specific amount of messages",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "amount",
			description: "the amount of messages you want to purge",
			type: "NUMBER",
			required: true
		}
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let amount = interaction.options.getNumber("amount");

			await interaction.channel.bulkDelete(1, true);

			let msg = interaction.channel.messages.fetch({ limit: amount });

			let filtered = (await msg).filter(
				(m) => Date.now() - m.createdTimestamp < ms("14 days")
			);

			setTimeout(() => {
				interaction.channel.bulkDelete(filtered);
			}, 750);
		} catch {
			interaction.followUp({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}
	}
};
