const { Client, VoiceChannel, MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Player} player
 * @param {VoiceChannel} oldChannel
 * @param {VoiceChannel} newChannel
 */

module.exports = async (client, player, oldChannel, newChannel) => {
	player.voiceChannel = client.channels.cache.get(newChannel);

	const channel = client.channels.cache.get(player.textChannel);
	channel.send({
		embeds: [
			new MessageEmbed()
				.setColor(process.env.SIGHEX)
				.setDescription(
					`**I have been moved from $<#${oldChannel.id}> to <#${newChannel.id}>**`
				)
		]
	});
};
