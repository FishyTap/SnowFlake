const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "clearplaylist",
	aliases: ["clpl"],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Clears out the tracks/urls from the playlist",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
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
			data.music.playlist.splice(0, data.music.playlist.length);
			data.save();

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							"**Successfully removed all the tracks/url from your playlist**"
						)
				]
			});
		}
	}
};
