const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { progressbar } = require("../../../utils/Progressbar");
const pMs = require("pretty-ms");

module.exports = {
  name: "nowplaying",
  description: "Shows the status of the current playing track",
  type: "CHAT_INPUT",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  callbacks: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const player = client.manager.players.get(interaction.guildId);

    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!player) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription("**There are no players currently**"),
        ],
      });
    }
    if (!voiceChannel) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription("**You must be in a voice channel**"),
        ],
      });
    } else if (player && voiceChannel !== interaction.guild.me.voice.channel) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription(
              `**You must be in the same voice channel as ${interaction.client.user}**`
            ),
        ],
      });
    } else if (!player.queue.current) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(process.env.REDHEX)
            .setDescription(`**No tracks are currently being played**`),
        ],
      });
    } else {
      let track = player.queue.current;
      let duration = track.duration;
      let position = player.position;
      let autoplay = player.get("autoplay");

      let aP;

      if (autoplay === false) {
        aP = "disabled";
      } else if (autoplay === true) {
        aP = "enabled";
      }

      let size = 25;
      let line = "▬";
      let slider = "🔘";

      let emoji = {
        muzik: client.emojis.cache.get("895892264256151572"),
        equalizer: client.emojis.cache.get("895897607128371280"),
        247: client.emojis.cache.get("895901356051808266"),
        loop: client.emojis.cache.get("895902356724678708"),
        autoplay: client.emojis.cache.get("895905227746705480"),
        sound: client.emojis.cache.get("895908507080065045"),
      };

      let loop;

      if (player.queueRepeat) loop = "queue";
      else if (player.trackRepeat) loop = "track";
      else loop = "off";

      let mode247;

      if (player.twentyFourSeven) mode247 = "enabled";
      else if (!player.twentyFourSeven) mode247 = "disabled";

      try {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(process.env.SIGHEX)
              .setAuthor({
                name: "Now Playing",
                iconURL: emoji.muzik?.url,
              })
              .setDescription(`**[${track.title}](${track.uri})**`)
              .addField(
                `${emoji.sound}  Volume`,
                `**\`${player.volume}%\`**`,
                true
              )
              .addField(
                `${emoji.equalizer}  Equalizer`,
                `**\`${player.filter}\`**`,
                true
              )
              .addField(`${emoji[247]}  24/7`, `**\`${mode247}\`**`, true)
              .addField(`${emoji.autoplay}  Autoplay`, `**\`${aP}\`**`, true)
              .addField(`${emoji.loop}  Loop`, `**\`${loop}\`**`, true)
              .addField(
                `**|**${progressbar(
                  duration,
                  position,
                  size,
                  line,
                  slider
                )}**|**`,
                `**Duration:  \`${pMs(position, { verbose: true })} / ${pMs(
                  duration,
                  { verbose: true }
                )}\`**`
              ),
          ],
        });
      } catch (err) {
        console.log(err);
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(process.env.REDHEX)
              .setDescription("**An Error Occured**"),
          ],
        });
      }
    }
  },
};
