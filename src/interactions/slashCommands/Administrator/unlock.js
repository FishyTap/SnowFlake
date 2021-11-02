const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "unlock",
	description: "Unlocks the current channel",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_CHANNELS"],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			const role = interaction.guild.roles.everyone;
			const perms = role.permissions.toArray();
			perms.push("SEND_MESSAGES");
			await role.edit({ permissions: perms });

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**Successfully Unlocked This Channel**"
						)
				]
			});
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
