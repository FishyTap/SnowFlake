const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Displays the avatar of a user",
  type: "CHAT_INPUT",
  options: [
    {
      name: "user",
      description: "the targetted user",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  callbacks: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    let member =
      interaction.guild.members.cache.get(
        interaction.options.getUser("user")?.id
      ) || interaction.guild.members.cache.get(interaction.user.id);

    if (!member) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription("**Unable to find the user**"),
        ],
      });
    }

    function avatarUrlFormat(user, size, format) {
      return user?.displayAvatarURL({
        size,
        format,
      });
    }

    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(member.roles.highest.hexColor)
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `**[PNG](${avatarUrlFormat(
              member.user,
              512,
              "png"
            )})    |    [JPG](${avatarUrlFormat(
              member.user,
              512,
              "jpg"
            )})    |    [JPEG](${avatarUrlFormat(
              member.user,
              512,
              "jpeg"
            )})    |    [WEBP](${avatarUrlFormat(member.user, 512, "webp")})**`
          )
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
