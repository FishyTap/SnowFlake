const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "mute",
	description: "Mutes a user",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "target",
			description: "the target you want to mute",
			type: "USER",
			required: true
		},
		{
			name: "time",
			description: "the time you want to mute the target",
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

		try {
			let target = interaction.options.getUser("target");
			let time = interaction.options.getString("time");

			const user = interaction.guild.members.cache.get(target.id);

			let muteRole = interaction.guild.roles.cache.find(
				(role) => role.name === "Muted"
			);

			if (!time) {
				user.roles.add(muteRole);

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(`**Successfully muted ${user}**`)
					]
				});
			} else {
				user.roles.add(muteRole);

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**Successfully muted ${user} for \`${pMs(
									ms(time),
									{ verbose: true }
								)}\`**`
							)
					]
				});

				let args = time.split(/[ ]+/);

				let t = 0;

				for (let i = 0; i < args.length; i++) {
					t += ms(args[i]);
				}

				setTimeout(() => {
					if (!user.roles.cache.has(muteRole)) return;

					user.roles.remove(muteRole);

					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`**Successfully unmuted ${user}**`
								)
						]
					});
				}, t);
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
