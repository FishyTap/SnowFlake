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

			if (amount > 100) {
				interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Invalid Amount**")
					]
				});
			}

			let msg = await interaction.channel.messages.fetch({
				limit: amount
			});

			let filtered = msg.filter(
				(m) => Date.now() - m.createdTimestamp < ms("14 days")
			);

			setTimeout(async () => {
				await interaction.channel?.bulkDelete(filtered);
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
