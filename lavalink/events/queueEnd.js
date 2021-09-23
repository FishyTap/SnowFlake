const {
    Client,
    MessageEmbed
} = require("discord.js");
const {
    Player
} = require("erela.js");

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 */

module.exports = (client, player) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({
        embeds: [
            new MessageEmbed()
            .setColor(process.env.SIGHEX)
            .setDescription("**Client Disconnected**")
        ]
    });
    player.destroy();
}