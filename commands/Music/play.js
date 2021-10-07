const { Client, Message, MessageEmbed } = require("discord.js");
const pMs = require("pretty-ms");

module.exports = {
	name: "play",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<name/playlist/url>",
	description: "Plays a track or playlist",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = message.client.manager.get(message.guild.id);

		if (!message.member.voice.channel) {
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
		} else if (!player) {
			var player = client.manager.create({
				guild: message.guild.id,
				voiceChannel: message.member.voice.channel.id,
				textChannel: message.channel.id,
				volume: 75,
				selfDeafen: true
			});
		}

		if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must state a track to play**")
				]
			});
		}

		if (player.state !== "CONNECTED") player.connect();
		player.set("autoplay", false);
		player.filter = "off";

		const search = args.join(" ");
		let res;

		try {
			res = await client.manager.search(search, message.author);
			if (res.loadType === "LOAD_FAILED") {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		} catch (err) {
			console.log(err);
			return message.reply({
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
				message.channel.send({
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
					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`**Added [${track.title}](${track.uri}) to queue**`
								)
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
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**Added ${res.playlist.name} to queue**`
							)
					]
				});
				break;
			case "SEARCH_RESULT":
				var track = res.tracks[0];
				player.queue.add(track);
				if (!player.playing && !player.paused && !player.queue.size) {
					return player.play();
				} else {
					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`**Added [${track.title}](${track.uri}) to queue**`
								)
						]
					});
				}
				break;
		}
	}
};
