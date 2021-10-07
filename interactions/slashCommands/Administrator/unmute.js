const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "unmute",
	description: "Unmutes a user",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "target",
			description: "the target you want to mute",
			type: "USER",
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
			let target = interaction.options.getUser("target");

			const user = interaction.guild.members.cache.get(target.id);

			let muteRole = interaction.guild.roles.cache.find(
				(role) => role.name === "Muted"
			);

			user.roles.remove(muteRole);

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Successfully unmuted ${user}**`)
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
