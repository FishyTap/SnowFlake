const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "lockdown",
	description: "Sets the lockdown of the current channel",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_CHANNELS"],
	options: [
		{
			name: "query",
			description: "choose a query",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "true",
					value: "true"
				},
				{
					name: "false",
					value: "false"
				}
			]
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let query = interaction.options.getString("query");

			const role = interaction.guild.roles.everyone;

			const perms = role.permissions.toArray();

			if (query === "false") {
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
			} else if (query === "true") {
				const newPerms = perms.filter(
					(perm) => perm !== "SEND_MESSAGES"
				);
				await role.edit({ permissions: newPerms });

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Successfully Locked This Channel**"
							)
					]
				});
			}
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
