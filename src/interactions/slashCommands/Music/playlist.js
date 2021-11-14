const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { create } = require("../../../mongo/functions/users/create");
const schema = require("../../../mongo/schemas/users");
const { Pagination } = require("../../../utils/Pagination");

let loadTracks = (player, res, interaction) => {
	try {
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

	if (player.state !== "CONNECTED") player.connect();
	player.set("autoplay", false);
	player.filter = "off";

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
				interaction.followUp({
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
			interaction.followUp({
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
				interaction.followUp({
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
};

module.exports = {
	name: "playlist",
	description: "Displays the playlist",
	type: "CHAT_INPUT",
	options: [
		{
			name: "create",
			description: "Creates a playlist for you",
			type: "SUB_COMMAND"
		},
		{
			name: "add",
			description: "Adds a track/url to your playlist",
			type: "SUB_COMMAND",
			options: [
				{
					name: "track",
					description:
						"the track/url you want to add to your playlist",
					type: "STRING",
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Removes a specific track/url from the playlist",
			type: "SUB_COMMAND",
			options: [
				{
					name: "index",
					description: "the index of the track/url in your playlist",
					type: "NUMBER",
					required: true
				}
			]
		},
		{
			name: "clear",
			description: "Clears out all the tracks/urls from the playlist",
			type: "SUB_COMMAND"
		},
		{
			name: "list",
			description: "Displays the playlist",
			type: "SUB_COMMAND"
		},
		{
			name: "delete",
			description: "Deletes your playlist",
			type: "SUB_COMMAND"
		},
		{
			name: "load",
			description: "Loads tracks/url to the queue",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "track",
					description: "Loads a track/url from the playlist",
					type: "SUB_COMMAND",
					options: [
						{
							name: "index",
							description:
								"the index of the track you want to play",
							type: "NUMBER",
							required: true
						}
					]
				},
				{
					name: "all",
					description:
						"this will add all the tracks/urls to the queue",
					type: "SUB_COMMAND"
				}
			]
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

		var data = await schema.findOne({ userId: interaction.user.id });

		if (interaction.options.getSubcommand() === "create") {
			if (!data) {
				data = await create(client, interaction.user.id);

				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**Successfully created a playlist for you**"
							)
					]
				});
			} else if (data) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You already have a playlist created**"
							)
					]
				});
			}
		} else if (!data) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must create a playlist before being able to manage it**"
						)
				]
			});
		} else if (data) {
			if (interaction.options.getSubcommand() === "add") {
				if (data.music.playlist.length > 30) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**Your playlist is full**")
						]
					});
				} else {
					const track = interaction.options.getString("track");
					await data.music.playlist.push(track);
					await data.save();

					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									"**Successfully added the track/url to the playlist**"
								)
						]
					});
				}
			} else if (interaction.options.getSubcommand() === "remove") {
				const index = interaction.options.getNumber("index");
				if (index <= 0) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**The given index subceeds the list limit**"
								)
						]
					});
				} else if (index > data.music.playlist.length) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**the given index exceeds the list limit**"
								)
						]
					});
				}

				await data.music.playlist.splice(index - 1, 1);
				await data.save();

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**Successfully removed the track or url from the list**"
							)
					]
				});
			} else if (interaction.options.getSubcommand() === "clear") {
				await data.music.playlist.splice(0, data.music.playlist.length);
				await data.save();

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								"**Successfully removed all the tracks/url from your playlist**"
							)
					]
				});
			} else if (interaction.options.getSubcommand() === "list") {
				if (data.music.playlist.length <= 0) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**There aren't anything in your list**"
								)
						]
					});
				}

				let pages = [];

				for (let i = 0; i < data.music.playlist.length; i += 10) {
					let v = data.music.playlist.slice(i, i + 10);

					let embed = new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setThumbnail(
							interaction.user.displayAvatarURL({ dynamic: true })
						)
						.setTitle(`The playlist of ${interaction.user.tag}`)
						.setDescription(
							[
								`${v
									.map((f, h) => `**${h + 1}.** **${f}**`)
									.join("\n")}`
							].join("\n")
						);

					pages.push(embed);
				}

				Pagination(interaction, pages, null, null, [true, true], true);
			} else if (interaction.options.getSubcommand() === "delete") {
				await schema.findOneAndDelete({
					userId: interaction.user.id
				});

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**Successfully deleted your playlist**`
							)
					]
				});
			} else if (interaction.options.getSubcommandGroup() === "load") {
				var player = client.manager.get(interaction.guildId);

				const guild = client.guilds.cache.get(interaction.guildId);
				const member = guild.members.cache.get(
					interaction.member.user.id
				);
				const voiceChannel = member.voice.channel;

				if (!voiceChannel) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription(
									"**You must be in a voice channel**"
								)
						]
					});
				} else if (!player) {
					var player = client.manager.create({
						guild: interaction.guildId,
						voiceChannel: voiceChannel.id,
						textChannel: interaction.channelId,
						volume: 75,
						selfDeafen: true
					});
				}

				if (player.state !== "CONNECTED") player.connect();
				player.set("autoplay", false);
				player.filter = "off";

				const sub = interaction.options.getSubcommand();

				if (sub === "all") {
					for await (let ik of data.music.playlist) {
						let res = await player.search(ik, interaction.user);
						if (res.loadType === "LOAD_FAILED") {
							if (!player.queue.current) player.destroy();
							throw res.exception;
						}

						await loadTracks(player, res, interaction);
					}
				} else if (sub === "track") {
					let index = interaction.options.getNumber("index");

					if (index <= 0) {
						return interaction.editReply({
							embeds: [
								new MessageEmbed()
									.setColor(process.env.REDHEX)
									.setDescription(
										"**The given index subceeds the list limit**"
									)
							]
						});
					} else if (index > data.music.playlist.length) {
						return interaction.editReply({
							embeds: [
								new MessageEmbed()
									.setColor(process.env.REDHEX)
									.setDescription(
										"**The given index exceeds the list limit**"
									)
							]
						});
					} else {
						let res = await player.search(
							data.music.playlist[index - 1],
							interaction.user
						);

						await loadTracks(player, res, interaction);
					}
				} else {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**You must choose an option**")
						]
					});
				}
			}
		}
	}
};
