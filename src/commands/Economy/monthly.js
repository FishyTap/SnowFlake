const { Client, Message, MessageEmbed } = require("discord.js");
const { create } = require("../../mongo/functions/users/create");
const coins = require("../../mongo/functions/users/coins");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "monthly",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Get your monthly injection of money",
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

		let thisMonth = Number(new Date().getUTCMonth()) + 1;

		if (data.economy.monthly > thisMonth) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You already claimed your monthly award**"
						)
						.setFooter(`Monthly Reset In: Next Month`)
						.setTimestamp()
				]
			});
		}

		let amount = Math.floor(Math.random() * 2000) + 1500;

		data.economy.monthly = thisMonth += 1;
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
