const { Client, Message, MessageEmbed } = require("discord.js");
const { create } = require("../../mongo/functions/users/create");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "createplaylist",
	aliases: ["crpl"],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Creates a playlist for you",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let data = await schema.findOne({ userId: message.author.id });
		if (!data) {
			data = await create(client, message.author.id);

			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							"**Successfully created a playlist for you**"
						)
				]
			});
		} else if (data) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You already have a playlist created**"
						)
				]
			});
		}
	}
};
