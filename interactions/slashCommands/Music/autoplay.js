const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Pagination } = require("../../../utils/Pagination");

module.exports = {
	name: "autoplay",
	description: "Toggles autoplay",
	type: "CHAT_INPUT",
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	callbacks: async (client, interaction, args) => {
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
		} else {
			const autoplay = player.get("autoplay");

			if (autoplay === false) {
				const identifier = player.queue.current.identifier;

				player.set("autoplay", true);
				player.set("requester", interaction.user);
				player.set("identifier", identifier);

				const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
				let res = await player.search(search, interaction.user);

				player.queue.add(res.tracks[1]);

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**🔄 Autoplay is now \`enabled\`**`
							)
					]
				});
			} else {
				player.set("autoplay", false);
				player.queue.clear();

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**🔄 Autoplay is now \`disabled\`**`
							)
					]
				});
			}
		}
	}
};
