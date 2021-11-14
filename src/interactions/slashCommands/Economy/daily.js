const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const { create } = require("../../../mongo/functions/users/create");
const coins = require("../../../mongo/functions/users/coins");
const schema = require("../../../mongo/schemas/users");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "daily",
	description: "Get your daily injection of money",
	type: "CHAT_INPUT",
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

		if (data.economy.daily > Date.now()) {
			let timeleft = data.economy.daily - Date.now();
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You already claimed your daily award**"
						)
						.setFooter(
							`Daily Resets At 00:00 UTC • Next Daily In: ${pMs(
								timeleft,
								{
									compact: true
								}
							)}`
						)
				]
			});
		}

		let amount = Math.floor(Math.random() * 750) + 250;

		data.economy.daily = new Date().setUTCHours(24, 0, 0, 0);
		await coins.wallet(client, user.id, amount);

		await data.save();

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						`**${amount.toLocaleString()} coins have been placed in your wallet**`
					)
			]
		});
	}
};
