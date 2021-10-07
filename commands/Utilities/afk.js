const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "afk",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<reason>",
	description: "Sets your afk status",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const reason = args.join(" ") || "No reason provided";

		client.afk.set(message.author.id, [
			Date.now(),
			reason,
			message.guild.id
		]);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setDescription(`**<@${message.author.id}> is now afk!**`)
			]
		});
	}
};
