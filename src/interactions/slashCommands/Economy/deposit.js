const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const coins = require("../../../mongo/functions/users/coins");
const { create } = require("../../../mongo/functions/users/create");
const schema = require("../../../mongo/schemas/users");

module.exports = {
	name: "deposit",
	description: "Deposits money from to bank",
	type: "CHAT_INPUT",
	options: [
		{
			name: "amount",
			description: "the amount you want to withdraw",
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
		await interaction.deferReply({
			ephemeral: false
		});

		let user = interaction.guild.members.cache.get(
			interaction.user.id
		).user;

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

		let amount = interaction.options.getString("amount");

		if (isNaN(amount)) {
			if (
				amount.toLowerCase() == "all" ||
				amount.toLowerCase() == "max"
			) {
				amount = Number(data.economy.wallet);

				await coins.bank(client, user.id, amount);
				await coins.wallet(client, user.id, -amount);
			} else {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You must state how the amount of money you want to deposit**"
							)
					]
				});
			}
		} else {
			amount = Number(amount);

			if (amount <= 0) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Unexpected deposit amount**")
					]
				});
			} else if (amount > data.economy.wallet) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Unexpected deposit amount**")
					]
				});
			} else {
				await coins.bank(client, user.id, amount);
				await coins.wallet(client, user.id, -amount);
			}
		}

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						[
							`**You have deposited ${Number(
								amount
							).toLocaleString()} coins from your bank**`
						].join("\n")
					)
			]
		});
	}
};
