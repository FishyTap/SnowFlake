const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Displays the avatar of a user",
	type: "CHAT_INPUT",
	options: [
		{
			name: "user",
			description: "the targetted user",
			type: "USER",
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

		let member =
			interaction.guild.members.cache.get(
				interaction.options.getUser("user")?.id
			) || interaction.guild.members.cache.get(interaction.user.id);

		if (!member) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Unable to find the user**")
				]
			});
		}

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(member.roles.highest.hexColor)
					.setAuthor(
						member.user.tag,
						member.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("**Download Links**")
					.addFields([
						{
							name: "_ _",
							value: `**[dynamic](${member.user.displayAvatarURL({
								dynamic: true,
								size: 512
							})})**`,
							inline: true
						},
						{
							name: "_ _",
							value: `**[png](${member.user.displayAvatarURL({
								format: "png",
								size: 512
							})})**`,
							inline: true
						},
						{
							name: "_ _",
							value: `**[jpg](${member.user.displayAvatarURL({
								format: "jpg",
								size: 512
							})})**`,
							inline: true
						}
					])
					.setImage(
						member.user.displayAvatarURL({
							dynamic: true,
							size: 512
						})
					)
			]
		});
	}
};
