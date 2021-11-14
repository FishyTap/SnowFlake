const { Client, Message, MessageEmbed } = require("discord.js");
const { create } = require("../../mongo/functions/users/create");
const coins = require("../../mongo/functions/users/coins");
const schema = require("../../mongo/schemas/users");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "daily",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Get your daily injection of money",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user = message.guild.members.cache.get(message.author.id)?.user;

		if (!user) {
			return message.channel.send({
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
			return message.channel.send({
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

		message.channel.send({
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
