const {
    Client,
    MessageEmbed
} = require("discord.js");
const {
    Player,
    TrackUtils
} = require("erela.js");
const pMs = require("pretty-ms");

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 * @param {TrackUtils} track 
 */

module.exports = (client, player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({
        embeds: [
            new MessageEmbed()
            .setColor(process.env.SIGHEX)
            .setTitle(`**🎵  Playing  🎵**`)
            .setDescription(`**[${track.title}](${track.uri})**`)
            .addFields({
                name: "⌛  Duration  ⌛",
                value: `\`${pMs(track.duration, { verbose: true })}\``,
                inline: true
            })
            .setThumbnail(track.thumbnail)
        ]
    });
}