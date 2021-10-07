const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const yts = require("yt-search");
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

			let trackUrl = track.uri;

			let trackId = trackUrl.replace(
				"https://www.youtube.com/watch?v=",
				""
			);

			let video = await yts({ videoId: trackId });

			let size = 25;
			let line = "▬";
			let slider = "🔘";

			let loop;

			if (player.queueRepeat) loop = "queue";
			else if (player.trackRepeat) loop = "track";
			else loop = "off";

			let mode247;

			if (player.twentyFourSeven) mode247 = "enabled";
			else if (!player.twentyFourSeven) mode247 = "disabled";

			let status = `**Volume:** **\`${player.volume}%\`**  **|**  **Equalizer: ** **\`${player.filter}\`**  **|**  **Loop:** **\`${loop}\`**\n**Autoplay:** **\`${aP}\`**  **|**  **24/7:** **\`${mode247}\`**`;

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setTitle("🎵  **Now Playing**  🎵")
						.setDescription(`**[${track.title}](${track.uri})**`)
						.setThumbnail(track.thumbnail)
						.addField(
							"🔊  Volume",
							`**\`${player.volume}%\`**`,
							true
						)
						.addField(
							"🧭  Equalizer",
							`**\`${player.filter}\`**`,
							true
						)
						.addField("🔁  Loop", `**\`${loop}\`**`, true)
						.addField("↪️  Autoplay", `**\`${aP}\`**`, true)
						.addField("🍀  24/7", `**\`${mode247}\`**`, true)
						.addField("\u200b", "\u200b", true)
						.addField(
							"👥  Views",
							`**\`${video.views.toLocaleString()}\`**`,
							true
						)
						.addField("📅  Uploaded", `**\`${video.ago}\`**`, true)
						.addField("\u200b", "\u200b", true)
						.addField(
							`**|**${progressbar(
								duration,
								position,
								size,
								line,
								slider
							)}**|**`,
							`**Duration:  \`${pMs(position, {
								verbose: true
							})} / ${pMs(duration, { verbose: true })}\`**`
						)
				]
			});
		}
	}
};
