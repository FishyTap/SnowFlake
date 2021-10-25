const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/users");

let loadTracks = (player, res, message) => {
	try {
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

	if (player.state !== "CONNECTED") player.connect();
	player.set("autoplay", false);
	player.filter = "off";

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
								`Added **[${track.title}](${track.uri}) to queue**`
							)
					]
				});
			}
			break;
	}
};

module.exports = {
	name: "loadplaylist",
	aliases: ["lopl"],
	cooldown: 0,
	permissions: [],
	usage: "<index/all>",
	description: "Loads tracks/urls from the playlist",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let data = await schema.findOne({ userId: message.author.id });

		if (!data) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must create a playlist before being able to manage it**"
						)
				]
			});
		} else if (data) {
			let player = client.manager.get(message.guild.id);

			if (!message.member.voice.channel) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You must be in a voice channel**"
							)
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
				player = client.manager.create({
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
							.setDescription(
								"**You must state an index from your playlist**"
							)
					]
				});
			}

			if (isNaN(args[0])) {
				if (args[0].toLowerCase() === "all") {
					for await (let i of data.music.playlist) {
						let res = await player.search(i, message.author);
						if (res.loadType === "LOAD_FAILED") {
							if (!player.queue.current) player.destroy();
							throw res.exception;
						}

						await loadTracks(player, res, message);
					}
				} else {
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**Invalid Index**")
						]
					});
				}
			} else if (!isNaN(args[0])) {
				if (args[0] <= 0) {
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**The given index subceeds the list limit**"
								)
						]
					});
				} else if (args[0] > data.music.playlist.length) {
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**The given index exceeds the list limit**"
								)
						]
					});
				} else {
					let index = parseInt(args[0]);
					let res = await player.search(
						data.music.playlist[index - 1],
						message.author
					);

					await loadTracks(player, res, message);
				}
			}
		}
	}
};
