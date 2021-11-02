const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "removeplaylist",
	aliases: ["rpl"],
	cooldown: 0,
	permissions: [],
	usage: "<index>",
	description: "Removes a specific track/url from the playlist",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args[0]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state an index to remove from your playlist**"
						)
				]
			});
		}

		let data = await schema.findOne({ userId: message.author.id });

		if (!data) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must create a playlist before being able to manage it**"
						)
				]
			});
		} else if (data) {
			let index = parseInt(args[0]);

			if (index <= 0) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**The given index subceeds the list limit**"
							)
					]
				});
			} else if (index > data.music.playlist.length) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**the given index exceeds the list limit**"
							)
					]
				});
			}

			data.music.playlist.splice(index - 1, 1);
			data.save();

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							"**Successfully removed the track or url from the list**"
						)
				]
			});
		}
	}
};
