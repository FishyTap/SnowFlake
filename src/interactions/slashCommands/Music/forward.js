const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");
const pMs = require("pretty-ms");

module.exports = {
	name: "forward",
	description: "Forwards a specific amount of time into the track",
	type: "CHAT_INPUT",
	options: [
		{
			name: "time",
			description: "forwardTime",
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

		let time = interaction.options.getString("time");

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
		} else {
			let args = time.split(/[ ]+/);

			let t = 0;

			for (let i = 0; i < args.length; i++) {
				t += ms(args[i]);
			}

			const position = player.position;
			const duration = player.queue.current.duration;

			if (t < duration - position) {
				player.seek(position + t);

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`⏩ **Track forwarded to  \`${pMs(
									player.position,
									{ compact: true }
								)}\`**`
							)
					]
				});
			} else {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Forward time exceeds the track duration**"
							)
					]
				});
			}
		}
	}
};
