const { Client, Message, MessageEmbed } = require("discord.js");
const coins = require("../../mongo/functions/users/coins");
const { create } = require("../../mongo/functions/users/create");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "deposit",
	aliases: ["dep"],
	cooldown: 0,
	permissions: [],
	usage: "<amount/all/max>",
	description: "Deposits money to your bank",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user = message.guild.members.cache.get(message.author.id).user;

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

		let amount = args[0];

		if (isNaN(amount)) {
			if (
				amount.toLowerCase() == "max" ||
				amount.toLowerCase() == "all"
			) {
				amount = Number(data.economy.wallet);

				await coins.bank(client, user.id, amount);
				await coins.wallet(client, user.id, -amount);
			} else {
				return message.channel.send({
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
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Unexpected deposit amount**")
					]
				});
			} else if (amount > data.economy.wallet) {
				return message.channel.send({
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

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(
						[
							`**You have deposited ${Number(
								amount
							).toLocaleString()} coins to your bank**`
						].join("\n")
					)
			]
		});
	}
};
