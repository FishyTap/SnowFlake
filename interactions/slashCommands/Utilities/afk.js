const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "afk",
	description: "Sets your afk status",
	type: "CHAT_INPUT",
	options: [
		{
			name: "reason",
			description: "the reason why you are afk",
			type: "STRING",
			required: false
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

		let reason = interaction.options.getString("reason");

		client.afk.set(interaction.user.id, [
			Date.now(),
			reason,
			interaction.guild.id
		]);

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(`**<@${interaction.user.id}> is now afk!**`)
			]
		});
	}
};
