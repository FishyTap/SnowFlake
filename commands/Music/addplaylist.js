const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "addplaylist",
	aliases: ["addpl"],
	cooldown: 0,
	permissions: [],
	usage: "<name/url>",
	description: "Adds a track/url to your playlist",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state a track or url to add to your playlist**"
						)
				]
			});
		} else {
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
				if (data.music.playlist.length > 50) {
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**Your playlist is full**")
						]
					});
				} else {
					data.music.playlist.push(args.join(" "));
					data.save();

					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									"**Successfully added the track/url to the playlist**"
								)
						]
					});
				}
			}
		}
	}
};
