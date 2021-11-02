const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const pMs = require("pretty-ms");

module.exports = {
	name: "search",
	description: "Searches a track or playlist",
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
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let input = interaction.options.getString("input");

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

		if (res.loadType === "NO_MATCHES") {
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
		} else if (res.loadType === "SEARCH_RESULT") {
			let track = "";

			for (let i = 0; i < 10; i++) {
				track += `
                    **${i + 1}.** **[${res.tracks[i].title}](${
					res.tracks[i].uri
				})**
                `;
			}

			await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setTitle("🔎  **Search Results**  🔎")
						.setDescription(track.substr(0, 2048))
				]
			});
			await interaction.channel
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
					let filter = (i) => i.author.id === interaction.user.id;

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
								return interaction.editReply({
									embeds: [
										new MessageEmbed()
											.setColor(process.env.REDHEX)
											.setDescription(
												"**Process Discontinued**"
											)
									]
								});

							if (isNaN(collector.first().content))
								return interaction.editReply({
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
								return interaction.editReply({
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
								interaction.editReply({
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
