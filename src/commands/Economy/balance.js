const { Client, Message, MessageEmbed } = require("discord.js");
const { create } = require("../../mongo/functions/users/create");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "balance",
	aliases: ["bal"],
	cooldown: 0,
	permissions: [],
	usage: "<optional: user>",
	description: "Shows the balance of a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user =
			message.mentions.members.first()?.user ||
			message.guild.members.cache.get(message.author.id)?.user;

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

		message.channel.send({
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
