const { Client, Message, MessageEmbed } = require("discord.js");
const yts = require("yt-search");
const { progressbar } = require("../../utils/Progressbar");
const pMs = require("pretty-ms");
const ytsr = require("youtube-sr").default;

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
			return message.channel.send({
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

			let ytData = await ytsr.getVideo(trackUrl);

			let video = await yts({ videoId: trackId });

			let size = 25;
			let line = "▬";
			let slider = "🔘";

			let emoji = {
				like: client.emojis.cache.get("895890322943520788"),
				dislike: client.emojis.cache.get("895890358326685696"),
				muzik: client.emojis.cache.get("895892264256151572"),
				equalizer: client.emojis.cache.get("895897607128371280"),
				247: client.emojis.cache.get("895901356051808266"),
				loop: client.emojis.cache.get("895902356724678708"),
				autoplay: client.emojis.cache.get("895905227746705480"),
				calender: client.emojis.cache.get("895908482371424286"),
				sound: client.emojis.cache.get("895908507080065045"),
				views: client.emojis.cache.get("895908524805226516")
			};

			let loop;

			if (player.queueRepeat) loop = "queue";
			else if (player.trackRepeat) loop = "track";
			else loop = "off";

			let mode247;

			if (player.twentyFourSeven) mode247 = "enabled";
			else if (!player.twentyFourSeven) mode247 = "disabled";

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setAuthor( "Now Playing", emoji.muzik.url)
						.setDescription(`**[${track.title}](${track.uri})**`)
						.setThumbnail(ytData.thumbnail.url)
						.addField(`${emoji.sound}  Volume`, `**\`${player.volume}%\`**`, true)
						.addField(`${emoji.equalizer}  Equalizer`, `**\`${player.filter}\`**`, true)
						.addField(`${emoji[247]}  24/7`, `**\`${mode247}\`**`, true)
						.addField(`${emoji.autoplay}  Autoplay`, `**\`${aP}\`**`, true)
						.addField(`${emoji.loop}  Loop`, `**\`${loop}\`**`, true)
						.addField(`${emoji.views}  Views`,`**\`${video?.views?.toLocaleString()}\`**`,true)
						.addField(`${emoji.like}  Likes`, `**\`${ytData.likes ? ytData?.likes.toLocaleString() : "None"}\`**`, true)
						.addField(`${emoji.dislike}  Dislikes`, `**\`${ytData.dislikes ? ytData?.dislikes.toLocaleString() : "None"}\`**`, true)
						.addField(`${emoji.calender}  Uploaded`,`**\`${video.ago}\`**`,true)
						.addField(
							`**|**${progressbar(duration, position, size, line, slider)}**|**`,
							`**Duration:  \`${pMs(position, {verbose: true})} / ${pMs(duration, { verbose: true })}\`**`
						)
				]
			});
		}
	}
};
