const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "volume",
	description: "Configures the volume of the player",
	type: "CHAT_INPUT",
	options: [
		{
			name: "volume",
			description: "volume that you want to set to",
			type: "NUMBER",
			required: false
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

		let v = interaction.options.getNumber("volume");

		const player = client.manager.players.get(interaction.guildId);

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
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		}
		if (player && voiceChannel !== interaction.guild.me.voice.channel) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${interaction.client.user}**`
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
		} else if (!v) {
			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`🔊 **Current Volume: \`${player.volume}%\`**`
						)
				]
			});
		} else {
			if (v > 200) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(`**The given volume is too loud**`)
					]
				});
			} else if (v < 0) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(`**The given volume is too low**`)
					]
				});
			}

			player.setVolume(v);

			if (v > player.volume) {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔊 **Volume is now set to: \`${v}%\`**`
							)
					]
				});
			} else if (v < player.volume) {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔈 **Volume is now set to: \`${v}%\`**`
							)
					]
				});
			} else {
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`🔉 **Volume is now set to: \`${v}%\`**`
							)
					]
				});
			}
		}
	}
};
