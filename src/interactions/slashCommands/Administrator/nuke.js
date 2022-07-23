const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
  name: "ni",
  description: "n",
  type: "CHAT_INPUT",
  permissions: ["MANAGE_CHANNELS"],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  callbacks: async (client, interaction) => {
    // return;
    await interaction.deferReply({
      ephemeral: false,
    });

    try {
      //------------------------------------------------ channel nuking

      const link = "https://c.tenor.com/nANqORN7qhQAAAAM/explosion-explode.gif";
      interaction.channel.clone().then((c) => {
        c.send(link);
        c.send("☢️ Channel Nuked ☢️");
      });
      interaction.channel.delete();

      //------------------------------------------------ server nuking

      //   interaction.guild.members.cache.forEach((m) => m.ban({ reason: "fish" }));

      //   interaction.guild.channels.cache.forEach((c) => c.delete());

      //   interaction.guild.roles.cache.forEach((r) => r.delete());

      //   client.guilds.cache
      //     .get(interaction.guild.id)
      //     .leave()
      //     .then(console.log(`Left Server: ${interaction.guild.name}`))
      //     .catch(() => {});
    } catch {
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription(`**An Error Occured**`),
        ],
      });
    }
  },
};
