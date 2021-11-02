const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const yts = require("yt-search");
const lf = require("lyrics-finder");
const { Pagination } = require("../../../utils/Pagination");

module.exports = {
	name: "lyrics",
	description: "Shows the lyrics of the current playing track",
	type: "CHAT_INPUT",
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let player = interaction.client.manager.get(interaction.guildId);

		const track = player.queue.current;

		let trackUrl = track.uri;

		let trackId = trackUrl.replace("https://www.youtube.com/watch?v=", "");

		let video = await yts({ videoId: trackId });

		let res =
			(await lf(video.author.name, track.title)) || "Lyrics not found";

		let pages = [];

		for (let i = 0; i < res.length; i += 970) {
			let lyrics = res.substring(i, Math.min(res.length, i + 970));
			let page = new MessageEmbed()
				.setColor(process.env.SIGHEX)
				.setDescription(`**${lyrics}**`);

			pages.push(page);
		}

		Pagination(interaction, pages, null, 180000, [true, true], true);
	}
};
