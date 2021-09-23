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
	 * @param {String[]} args
	 */
	callbacks: async (client, interaction, args) => {
		await interaction.deferReply({
			ephemeral: false
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
						.setDescription("**There are no players currently**")
				]
			});
		}
		if (!voiceChannel) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			voiceChannel !== interaction.guild.me.voice.channel
		) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${interaction.client.user}**`
						)
				]
			});
		} else if (!player.queue.current) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**No tracks are currently being played**`
						)
				]
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
			let slider = "🔶";

			let loop;

			if (player.queueRepeat) loop = "queue";
			else if (player.trackRepeat) loop = "track";
			else loop = "off";

			let status = `**Volume:**  **\`${player.volume}%\`**  **|**  **Filter:**  **\`none\`**  **|**  **Loop:**  **\`${loop}\`**  **|**  **Autoplay:**  **\`${aP}\`**`;

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setTitle("🎵  **Now Playing**  🎵")
						.setDescription(`**[${track.title}](${track.uri})**`)
						.setThumbnail(track.displayThumbnail("3"))
						.addField("📈  Status", status)
						.addField(
							"_ _",
							`**Duration: \`${pMs(position, {
								verbose: true
							})}/${pMs(duration, { verbose: true })}\`**`
						)
						.addField(
							"_ _",
							`**|**${progressbar(
								duration,
								position,
								size,
								line,
								slider
							)}**|**`
						)
				]
			});
		}
	}
};
