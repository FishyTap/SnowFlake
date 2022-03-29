const { Client, MessageEmbed, ContextMenuInteraction } = require("discord.js");

module.exports = {
  name: "Display Avatar",
  type: "USER",
  /**
   *
   * @param {Client} client
   * @param {ContextMenuInteraction} interaction
   */
  callbacks: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    let member = interaction.guild.members.cache.get(interaction.targetId);

    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(member.roles.highest.hexColor)
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          })
          .setImage(
            member.user.displayAvatarURL({
              dynamic: true,
              size: 512,
            })
          ),
      ],
    });
  },
};
