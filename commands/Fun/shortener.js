const { Client, Message, MessageEmbed } = require("discord.js");
const isgd = require("isgd");

module.exports = {
	name: "linkshortener",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<>",
	description: "",
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
						.setColor("RED")
						.setDescription(
							"Command: -l <url> <optional: custom/shorten>"
						)
				]
			});
		}

		if (!args[1]) {
			isgd.custom(args[0], args[1], function (res) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(res)
					]
				});
			});
		} else {
			isgd.shorten("http://google.com", function (res) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(res)
					]
				});
			});
		}
	}
};
