const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "user",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<user/none>",
	description: "Shows the information of a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const User = message.mentions.members.first() || message.member;
		let game = User.presence.game;
		let status = User.presence.status;

		if (status === "idle") status = "Idle";
		if (status == "online") status = "Online";
		if (status == "offline") status = "Offline";
		if (status == "dnd") status = "Do Not Disturb";

		const roles = User.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);

		let displayRoles;

		if (roles.length < 20) {
			displayRoles = roles.join(" ");
			if (roles.length < 1) displayRoles = "None";
		} else {
			displayRoles = roles.slice(20).join(" ");
		}

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(User.displayColor)
					.setThumbnail(User.user.displayAvatarURL({ dynamic: true }))
					.setAuthor(
						`Information of ${User.user.username}`,
						User.user.displayAvatarURL({
							dynamic: true
						})
					)
					.addField(
						`**Username: **`,
						User.user.username || "None",
						true
					)
					.addField(`**Tag: **`, `${User.user.tag}`, true)
					.addField(`**ID: **`, `${User.id}`, true)
					.addField(`**Status: **`, `${status}`, true)
					.addField(`**Game: **`, `${game || "None"}`, true)
					.addField("\u200b", "\u200b")
					.addField(
						`**Account Created At: **`,
						`${moment(User.createdAt).format(
							"DD-MM-YYYY [at] HH:mm"
						)}`,
						true
					)
					.addField(
						`**Joined The Server At: **`,
						`${moment(User.joinedAt).format(
							"DD-MM-YYYY [at] HH:mm"
						)}`,
						true
					)
					.addField(`**Roles: [${roles.length}]**`, `${displayRoles}`)
			]
		});
	}
};
