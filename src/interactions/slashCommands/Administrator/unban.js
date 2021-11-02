const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "unban",
	description: "Unbans a user",
	type: "CHAT_INPUT",
	permissions: ["BAN_MEMBERS"],
	options: [
		{
			name: "id",
			description: "target id",
			type: "STRING",
			required: true
		}
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		interaction.deferReply({
			ephemeral: false
		});

		try {
			let id = interaction.options.getString("id");

			if (isNaN(id)) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Invalid ID**")
					]
				});
			}
			let fetchedBans = await interaction.guild.bans.fetch();

			if (!fetchedBans.find((u) => u.user.id === id))
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Unable to fetch the ID**")
					]
				});

			await interaction.guild.members.unban(id);

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Successfully unbanned <@${id}>**`)
				]
			});
		} catch {
			interaction.followUp({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**An Error Occured**`)
				]
			});
		}
	}
};
