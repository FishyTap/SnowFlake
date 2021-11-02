const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
	name: "clearqueue",
	description: "Clears the queue",
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
		} else if (!player.queue.size) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**The queue is currently empty**`)
				]
			});
		} else if (player && player.queue.current) {
			player.queue.clear();

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription("**The queue has been cleared**")
				]
			});
		}
	}
};
