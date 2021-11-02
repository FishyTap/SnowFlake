const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "unban",
	aliases: [],
	cooldown: 0,
	permissions: ["BAN_MEMBERS"],
	usage: "<ID>",
	description: "Unbans a user",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let user = args[0];

		if (!user)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state the ID of the user you want to unban**"
						)
				]
			});

		if (isNaN(user))
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Invalid ID**")
				]
			});

		let fetchedBans = message.guild.bans.fetch();

		if (!(await fetchedBans).find((u) => u.user.id === user))
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Unable to fetch the ID**")
				]
			});

		message.guild.members.unban(user);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.REDHEX)
					.setDescription(`**Successfully unbanned <@${user}>**`)
			]
		});
	}
};
