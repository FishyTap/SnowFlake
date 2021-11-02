const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "247",
	description: "Toggles 24/7 mode",
	type: "CHAT_INPUT",
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

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
			if (player.twentyFourSeven) {
				player.twentyFourSeven = false;

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**24/7 Mode is now  \`disabled\`**`
							)
					]
				});
			} else {
				player.twentyFourSeven = true;

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(`**24/7 Mode is now  \`enabled\`**`)
					]
				});
			}
		}
	}
};
