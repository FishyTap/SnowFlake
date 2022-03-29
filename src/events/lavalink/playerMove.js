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
  const channel = client.channels.cache.get(newChannel);

  if (channel.members >= 1) {
    player.pause(false);
  }
  player.pause(true);
  player.setVoiceChannel(channel);

  await client.channels.cache.get(player.textChannel).send({
    embeds: [
      new MessageEmbed()
        .setColor(process.env.SIGHEX)
        .setDescription(
          `**I have been moved from  <#${oldChannel}>  to  <#${newChannel}>**`
        ),
    ],
  });
};
