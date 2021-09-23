const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const pMs = require("pretty-ms");

module.exports = {
	name: "play",
	description: "Plays a track or playlist",
	type: "CHAT_INPUT",
	options: [
		{
			name: "input",
			description: "search input <name/url>",
			type: "STRING",
			required: true
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	callbacks: async (client, interaction, args) => {
		await interaction.deferReply({
			ephemeral: false
		});

		const [input] = args;

		var player = client.manager.get(interaction.guildId);

		const guild = client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if (!voiceChannel) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (!player) {
			var player = client.manager.create({
				guild: interaction.guildId,
				voiceChannel: voiceChannel.id,
				textChannel: interaction.channelId,
				volume: 100,
				selfDeafen: true
			});
		}

		if (player.state !== "CONNECTED") player.connect();
		player.set("autoplay", false);

		let res;

		try {
			res = await client.manager.search(input, interaction.user);
			if (res.loadType === "LOAD_FAILED") {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		} catch (err) {
			console.log(err);
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**An Error Occured**`)
				]
			});
		}

		switch (res.loadType) {
			case "NO_MATCHES":
				if (!player.queue.current) player.destroy();
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**No results were found with the given query**`
							)
					]
				});
				break;
			case "TRACK_LOADED":
				var track = res.tracks[0];
				player.queue.add(track);

				if (!player.playing && !player.paused && !player.queue.size) {
					return player.play();
				} else {
					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setTitle(`**🎶  Added Track To Queue  🎶**`)
								.setDescription(
									`**[${track.title}](${track.uri})**`
								)
								.addFields({
									name: "⌛  Duration  ⌛",
									value: `**\`${pMs(track.duration, {
										verbose: true
									})}\`**`,
									inline: true
								})
								.setThumbnail(track.thumbnail)
						]
					});
				}
				break;
			case "PLAYLIST_LOADED":
				player.queue.add(res.tracks);

				if (
					!player.playing &&
					!player.paused &&
					player.queue.totalSize === res.tracks.length
				)
					player.play();
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle(`**🎶  Added Playlist To Queue  🎶**`)
							.setDescription(`**${res.playlist.name}**`)
							.addFields(
								{
									name: "⌛  Duration  ⌛",
									value: `**\`${pMs(track.duration, {
										verbose: true
									})}\`**`,
									inline: true
								},
								{
									name: "Length",
									value: `\`${res.tracks.length}\``,
									inline: true
								}
							)
							.setThumbnail(track.thumbnail)
					]
				});
				break;
			case "SEARCH_RESULT":
				var track = res.tracks[0];
				player.queue.add(track);
				if (!player.playing && !player.paused && !player.queue.size) {
					return player.play();
				} else {
					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setTitle(`**🎶  Added Track To Queue  🎶**`)
								.setDescription(
									`**[${track.title}](${track.uri})**`
								)
								.addFields({
									name: "⌛  Duration  ⌛",
									value: `**\`${pMs(track.duration, {
										verbose: true
									})}\`**`,
									inline: true
								})
								.setThumbnail(track.thumbnail)
						]
					});
				}
				break;
		}
	}
};
