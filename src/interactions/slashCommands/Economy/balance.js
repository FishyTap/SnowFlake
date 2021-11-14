const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const { create } = require("../../../mongo/functions/users/create");
const schema = require("../../../mongo/schemas/users");

module.exports = {
	name: "balance",
	description: "Shows the balance of a user",
	type: "CHAT_INPUT",
	options: [
		{
			name: "user",
			description: "the user you want to check",
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

		let user =
			interaction.options.getUser("user") ||
			interaction.guild.members.cache.get(interaction.user.id).user;

		if (!user) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Unable to find the user**")
				]
			});
		}

		let data = await schema.findOne({ userId: user.id });

		if (!data) {
			data = await create(client, user.id);
		}

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle(`${user.username}'s balance`)
					.setDescription(
						[
							`**Wallet:** ${Number(
								data?.economy?.wallet
							).toLocaleString()}`,
							`**Bank:** ${Number(
								data?.economy?.bank
							).toLocaleString()}`
						].join("\n")
					)
					.setFooter("🍁")
					.setTimestamp()
			]
		});
	}
};
