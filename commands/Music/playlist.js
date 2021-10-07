const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/users");
const { Pagination } = require("../../utils/Pagination");

module.exports = {
	name: "listplaylist",
	aliases: ["lipl"],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Displays the playlist",
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
			if (data.playlist.length <= 0) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**There aren't anything in your list**"
							)
					]
				});
			}

			let pages = [];

			for (let i = 0; i < data.playlist.length; i += 10) {
				let v = data.playlist.slice(i, i + 10);

				let embed = new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setThumbnail(
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`The playlist of ${message.author.tag}`)
					.setDescription(
						[
							`${v
								.map((f, h) => `**${h + 1}.** **${f}**`)
								.join("\n")}`
						].join("\n")
					);

				pages.push(embed);
			}

			Pagination(message, pages, null, null, [true, true], false);
		}
	}
};
