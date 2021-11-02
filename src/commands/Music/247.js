const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "247",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Toggles the 24/7 mode",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = message.client.manager.get(message.guild.id);

		if (!message.member.voice.channel) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${message.client.user}**`
						)
				]
			});
		} else {
			if (player.twentyFourSeven) {
				player.twentyFourSeven = false;

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(`**24/7 Mode is now \`disabled\`**`)
					]
				});
			} else {
				player.twentyFourSeven = true;

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(`**24/7 Mode is now \`enabled\`**`)
					]
				});
			}
		}
	}
};
