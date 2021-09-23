const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "setvolume",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<volume>",
	description: "Sets the volume of the client",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = client.manager.players.get(message.guild.id);

		if (!player) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		} else if (!message.member.voice.channel) {
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
		} else if (!player.queue.current) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**No tracks are currently being played**`
						)
				]
			});
		} else if (!args[0]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**You must state a volume**`)
				]
			});
		} else if (isNaN(args[0])) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**Invalid Percentage**`)
				]
			});
		} else {
			let volume = Number(args[0]);

			if (volume > 200) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(`**Volume too loud**`)
					]
				});
			} else if (volume < 0) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(`**Volume too low**`)
					]
				});
			}

			player.setVolume(volume);

			if (volume > player.volume) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔊 **Volume is now set to: \`${volume}%\`**`
							)
					]
				});
			} else if (volume < player.volume) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔈 **Volume is now set to: \`${volume}%\`**`
							)
					]
				});
			} else {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔉 **Volume is now set to: \`${volume}%\`**`
							)
					]
				});
			}
		}
	}
};
