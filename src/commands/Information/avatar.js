const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "avatar",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<optional: user>",
	description: "Displays the avatar of a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(message.author.id);

		if (!member) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Unable to find the user**")
				]
			});
		}

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(member.roles.highest.hexColor)
					.setAuthor(
						member.user.tag,
						member.user.displayAvatarURL({ dynamic: true })
					)
					.setDescription(
						`**[PNG](${avatarUrlFormat(
							member.user,
							512,
							"png"
						)})    |    [JPG](${avatarUrlFormat(
							member.user,
							512,
							"jpg"
						)})    |    [JPEG](${avatarUrlFormat(
							member.user,
							512,
							"jpeg"
						)})    |    [WEBP](${avatarUrlFormat(
							member.user,
							512,
							"webp"
						)})**`
					)
					.setImage(
						member.user.displayAvatarURL({
							dynamic: true,
							size: 512
						})
					)
			]
		});
	}
};
