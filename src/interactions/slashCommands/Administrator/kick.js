const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "kick",
	description: "Kicks a user",
	type: "CHAT_INPUT",
	permissions: ["KICK_MEMBERS"],
	options: [
		{
			name: "user",
			description: "the targetted user",
			type: "USER",
			required: true
		},
		{
			name: "reason",
			description: "the reason for this ban",
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
			let user = interaction.options.getUser("user");
			let reason = interaction.options.getString("reason");

			const target = interaction.guild.members.cache.get(user.id);

			if (
				interaction.member.roles.highest.position <=
				target.roles.highest.position
			)
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You can't kick a user who has a higher position than you**"
							)
					]
				});

			try {
				await target.send({
					embeds: [
						new MessageEmbed().setColor(process.env.REDHEX)
							.setDescription(`
                                **You have been kicked from ${interaction.guild.name}**
                                **Reason: **${reason}
                            `)
					]
				});
			} catch {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**The user has their Dms disabled so they will not be notified**`
							)
					]
				});
			}

			target.kick(reason);

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(`**Successfully kicked ${target}**`)
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
