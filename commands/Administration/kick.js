const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "kick",
	aliases: [],
	cooldown: 0,
	permissions: ["KICK_MEMBERS"],
	usage: "<user> <reason>",
	description: "Kicks a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		if (!message.mentions.members.first() && isNaN(args[0])) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must state a valid ID**")
				]
			});
		}

		if (!user)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must state a user to kick**")
				]
			});

		if (
			message.member.roles.highest.position <= user.roles.highest.position
		)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You can't kick a user who has a higher position than you**"
						)
				]
			});

		let reason = args.slice(1).join(" ") || "No reason provided";

		try {
			await user.send({
				embeds: [
					new MessageEmbed().setColor(process.env.REDHEX)
						.setDescription(`
							**You have been kicked from ${message.guild.name}**
							**Reason: **${reason}
						`)
				]
			});
		} catch {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**The user has their Dms disabled so they will not be notified**`
						)
				]
			});
		}

		user.kick(reason);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(`**Successfully kicked ${user}**`)
			]
		});
	}
};
