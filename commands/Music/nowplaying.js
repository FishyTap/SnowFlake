const { Client, Message, MessageEmbed } = require("discord.js");
const { progressbar } = require("../../utils/Progressbar");
const pMs = require("pretty-ms");

module.exports = {
	name: "nowplaying",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "Shows the status of the current playing track",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = message.client.manager.get(message.guild.id);

		if (!player) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		} else if (!message.member.voice.channel) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${message.client.user}**`
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

			message.channel.send({
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
