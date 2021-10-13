const {
	Client,
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageButton
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "chess",
	aliases: [],
	cooldown: 30,
	permissions: [],
	usage: "<none>",
	description: "Creates a Chess In The Park activity",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		}

		let emoji = client.emojis.cache.get("896341842843561984");

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
					target_application_id: "832012586023256104",
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
					return message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.REDHEX)
								.setDescription("**An Error Occured**")
						]
					});
				}

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(`> ${emoji}  **Chess In The Park**`)
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
