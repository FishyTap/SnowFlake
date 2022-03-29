const {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const {
  capitalizeFirstLetter,
} = require("../../../utils/CapitalizeFirstLetter");

const categoryEmojis = {
  ADMINISTRATOR: "🔒",
  DEVELOPER: "🌐",
  FUN: "🎮",
  INFORMATION: "🔎",
  MUSIC: "🎧",
  UTILITIES: "⚙",
  ECONOMY: "💳",
};

module.exports = {
  name: "help",
  description:
    "Displays the help panel or shows the datails of a specific command",
  type: "CHAT_INPUT",
  options: [
    {
      name: "input",
      description: "the command you want to the datails of",
      type: "STRING",
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  callbacks: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    let input = interaction.options.getString("input");

    if (!input) {
      let categories = [];

      fs.readdirSync(path.join(__dirname, "..")).forEach((dir) => {
        let data = new Object();

        data = {
          name: `**${categoryEmojis[dir.toUpperCase()]} ${capitalizeFirstLetter(
            dir.toLowerCase()
          )}**`,
          value: `\`\`\`${client.prefix}help ${dir.toLowerCase()}\`\`\``,
          inline: true,
        };

        categories.push(data);
      });

      let row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Invite")
          .setStyle("LINK")
          .setURL(
            `https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`
          )
      );

      let embed = new MessageEmbed()
        .setColor(process.env.SIGHEX)
        .setTitle("📫 **Need help?**")
        .setDescription(
          `${[
            `**SnowFlake is a Multi-Purpose bot with many Accessibilities and Features!**`,
            `\u200b`,
            `**Use \`${client.prefix}help [input]\`**`,
            `> **Input:** *A command or category name*`,
          ].join("\n")}`
        )
        .addFields(categories);

      interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    } else {
      let dirs = [];
      let commands = [];

      fs.readdirSync(path.join(__dirname, "..")).forEach((dir) => {
        dirs.push(`${dir.toLowerCase()}`);

        const cmd = fs
          .readdirSync(path.join(__dirname, "..", dir))
          .filter((files) => files.endsWith(".js"));

        const cmds = cmd.map((command) => {
          let file = require(path.join(__dirname, "..", dir, command));

          if (!file.name) return "No name provided";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let desc = new Object();

        desc = {
          ADMINISTRATION:
            "These are the Administration commands. Only the staffs can use these commands regarding their permissions!",
          FUN: "These are the Fun commands. You can play games and have fun with your friends!",
          INFORMATION:
            "These are the Information commands. You can use these commands to get information that you are looking for!",
          MUSIC:
            "These are the Music commands. You can play any song or playlist that you want!",
          ECONOMY:
            "These are the Economy commands. You can earn money but make sure to manage them well!",
          UTILITIES:
            "These are the Utilities commands. Some of the commands requires you to have certain permissions before using!",
        };

        let data = new Object();

        data = {
          name: `${capitalizeFirstLetter(dir.toLowerCase())}`,
          value: cmds.length === 0 ? "NONE" : cmds.join(" "),
          emoji: `${categoryEmojis[dir.toUpperCase()]}`,
          description: desc[dir.toUpperCase()]
            ? `${desc[dir.toUpperCase()]}`
            : "NONE",
          size: cmd.length,
        };

        commands.push(data);
      });

      if (dirs.includes(input.toLowerCase())) {
        let index = dirs.indexOf(input.toLowerCase());
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(process.env.SIGHEX)
              .setTitle(
                `${commands[index].emoji} __**${commands[index].name} Commands**__`
              )
              .setDescription(`${commands[index].description}`)
              .addFields({
                name: `Commands [${commands[index].size}]`,
                value: commands[index].value,
              }),
          ],
        });
      } else {
        const cmd =
          client.interactions.get(input.toLowerCase()) ||
          client.interactions.find(
            (col) => col.aliases && col.aliases.includes(input.toLowerCase())
          );

        if (!cmd) {
          return interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setColor(process.env.SIGHEX)
                .setDescription(`**Unknown Query**`),
            ],
          });
        }

        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(process.env.SIGHEX)
              .setTitle(`__**${capitalizeFirstLetter(cmd.name)} Command**__`)
              .addField(
                "**COMMAND:**",
                cmd.name
                  ? `**\`${cmd.name}\`**`
                  : "**`No name for this command`**",
                true
              )
              .addField(
                "**COOLDOWN:**",
                cmd.cooldown
                  ? `**\`${cmd.cooldown} seconds\`**`
                  : `**\`none\`**`,
                true
              )
              .addField(
                "**PERMISSIONS:**",
                !cmd.permissions?.length <= 0
                  ? `**\`${cmd.permissions.join("` `")}\`**`
                  : "**`None`**",
                true
              )
              .addField(
                "**DESCRIPTION:**",
                cmd.description
                  ? `**\`${cmd.description}\`**`
                  : "**`No description for this command`**",
                true
              ),
          ],
        });
      }
    }
  },
};
