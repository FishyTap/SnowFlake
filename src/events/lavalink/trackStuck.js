const { MessageEmbed, Client } = require("discord.js");
const { Player, TrackUtils } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Player} player
 * @param {TrackUtils} track
 * @param {*} payload
 */

module.exports = async (client, player, track, payload) => {
	const channel = client.channels.cache.get(player.textChannel);
	channel.send({
		embeds: [
			new MessageEmbed()
				.setColor(process.env.REDHEX)
				.setDescription("**The track got stuck**")
		]
	});
	if (!player.voiceChannel) player.destroy();
};
