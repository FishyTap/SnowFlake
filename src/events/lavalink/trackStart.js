const { MessageEmbed, Client } = require("discord.js");
const { Player, TrackUtils } = require("erela.js");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 * @param {Player} player
 * @param {TrackUtils} track
 */

module.exports = async (client, player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  channel.send({
    embeds: [
      new MessageEmbed()
        .setColor(process.env.SIGHEX)
        .setDescription(`**Now playing [${track.title}](${track.uri})**`),
    ],
  });
};
