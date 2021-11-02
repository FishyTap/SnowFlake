const { Client, Message, MessageEmbed } = require("discord.js");
const pMs = require("pretty-ms");

module.exports = {
	name: "search",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<name/playlist/url>",
	description: "Searches several results with the given query",
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
				volume: 100,
				selfDeafen: true
			});
		}

		if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state something to search**"
						)
				]
			});
		}

		if (player.state !== "CONNECTED") player.connect();
		player.set("autoplay", false);

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

		if (res.loadType === "NO_MATCHES") {
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
		} else if (res.loadType === "SEARCH_RESULT") {
			let track = "";

			for (let i = 0; i < 10; i++) {
				track += `
                    **${i + 1}.** **[${res.tracks[i].title}](${
					res.tracks[i].uri
				})**
                `;
			}

			await message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setTitle("🔎  **Search Results**  🔎")
						.setDescription(track.substr(0, 2048))
				]
			});
			await message.channel
				.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**Please state the index of the track you want to play**"
							)
							.setFooter("Respond with 'cancel' to discontinue")
					]
				})
				.then(async (msg) => {
					let filter = (i) => i.author.id === message.author.id;

					await msg.channel
						.awaitMessages({
							filter,
							max: 1,
							time: 30 * 1000
						})
						.then(async (collector) => {
							if (
								collector.first().content.toLowerCase() ===
								"cancel"
							)
								return message.channel.send({
									embeds: [
										new MessageEmbed()
											.setColor(process.env.REDHEX)
											.setDescription(
												"**Process Discontinued**"
											)
									]
								});

							if (isNaN(collector.first().content))
								return message.channel.send({
									embeds: [
										new MessageEmbed()
											.setColor(process.env.REDHEX)
											.setDescription("**Invalid Index**")
									]
								});

							if (
								Number(collector.first().content) <= 0 &&
								10 < Number(collector.first().content)
							)
								return message.channel.send({
									embeds: [
										new MessageEmbed()
											.setColor(process.env.REDHEX)
											.setDescription(
												"**Invalid Respond**"
											)
									]
								});

							const index = collector.first().content;

							const tr = res.tracks[index - 1];

							player.queue.add(tr);
							if (
								!player.playing &&
								!player.paused &&
								!player.queue.size
							) {
								return player.play();
							} else {
								message.channel.send({
									embeds: [
										new MessageEmbed()
											.setColor(process.env.SIGHEX)
											.setTitle(
												`**🎶  Added Track To Queue  🎶**`
											)
											.setDescription(
												`**[${tr.title}](${tr.uri})**`
											)
											.addFields({
												name: "⌛  Duration  ⌛",
												value: `**\`${pMs(tr.duration, {
													verbose: true
												})}\`**`,
												inline: true
											})
											.setThumbnail(tr.thumbnail)
									]
								});
							}
						});
				});
		}
	}
};
