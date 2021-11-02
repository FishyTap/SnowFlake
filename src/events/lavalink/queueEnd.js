const { MessageEmbed, Client } = require("discord.js");
const { Player } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Player} player
 * @returns
 */

module.exports = (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	channel.send({
		embeds: [
			new MessageEmbed()
				.setColor(process.env.SIGHEX)
				.setDescription("**Queue ended**")
		]
	});
	if (player.twentyFourSeven) return;
	else player.destroy();
};
