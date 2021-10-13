const {
	Client,
	MessageEmbed,
	CommandInteraction,
	MessageActionRow,
	MessageButton
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "fishington",
	description: "Creates a Fishington.io activity",
	type: "CHAT_INPUT",
	cooldown: 30,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {Array} args
	 */
	callbacks: async (client, interaction, args) => {
		await interaction.deferReply({
			ephemeral: false
		});

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
		}

		let emoji = client.emojis.cache.get("896341327791390741");

		await fetch(
			`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`,
			{
				headers: {
					Authorization: `Bot ${client.token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					max_age: 0,
					max_uses: 0,
					target_application_id: "814288819477020702",
					target_type: 2,
					temporary: false,
					validate: null
				}),
				method: "POST"
			}
		)
			.then((res) => res.json())
			.then(async (invite) => {
				if (!invite.code) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**An Error Occured**")
						]
					});
				}

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`> ${emoji}  **${invite.target_application.name}**`
							)
					],
					components: [
						new MessageActionRow().addComponents(
							new MessageButton()
								.setStyle("LINK")
								.setURL(
									`https://discord.com/invite/${invite.code}`
								)
								.setEmoji(emoji)
								.setLabel("Click To Join")
						)
					]
				});
			})
			.catch(() => {});
	}
};
