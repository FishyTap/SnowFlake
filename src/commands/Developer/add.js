const { Client, Message, MessageEmbed } = require("discord.js");
const { create } = require("../../mongo/functions/users/create");
const { wallet } = require("../../mongo/functions/users/coins");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "add",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Adds an amount of coins to yourself",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(message.author.id);

		if (!user) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Unable to find the user**")
				]
			});
		}

		let data = await schema.findOne({ userId: user.user.id });

		if (!data) {
			data = await create(client, user.user.id);
		}

		let amount = Number(args[0]);

		await wallet(client, user.user.id, amount);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setAuthor(
						user.user.displayAvatarURL({ dynamic: true }),
						user.user.tag
					)
					.setDescription(
						`**Added ${amount} to ${user.user.username}'s wallet**`
					)
			]
		});
	}
};
