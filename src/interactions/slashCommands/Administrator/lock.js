const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "lock",
	description: "Locks the current channel",
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
			const newPerms = perms.filter((perm) => perm !== "SEND_MESSAGES");

			await role.edit({ permissions: newPerms });

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Successfully Locked This Channel**")
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
