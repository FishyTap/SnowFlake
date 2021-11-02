const {
	Client,
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu
} = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "support",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Gives the user some support",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let time = ms("10s");

		let row = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setPlaceholder("Please choose an option")
					.setCustomId("support-menu")
					.addOptions([
						{
							label: "Invite Link",
							value: "invite",
							description: "Adds the bot to another server",
							emoji: "🏷"
						},
						{
							label: "Community",
							value: "community",
							description: "Let's you join our community server",
							emoji: "🎯"
						}
					])
			)
		];

		await message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("🛠 Support")
					.setDescription(
						`> **Use the menu below to navigate to the support you are looking for**`
					)
			],
			components: [...row]
		});

		let button = (k, e, i) => [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle("LINK")
					.setURL(k)
					.setEmoji(e)
					.setDisabled(i)
			)
		];

		let collector = message.channel.createMessageComponentCollector({
			componentType: "SELECT_MENU",
			time
		});

		collector.on("collect", async (inter) => {
			await inter.deferReply({
				ephemeral: true
			});

			let value = inter.values[0];

			if (value == "invite") {
				await inter.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle("🏷 Invite Link")
							.setDescription(
								`**> Press the button below or click [here](https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands) to invite me to another server**`
							)
					],
					components: [
						...button(
							`https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`,
							"🏷",
							false
						)
					]
				});

				setTimeout(async () => {
					await inter.editReply({
						components: [
							...button(
								`https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`,
								"🏷",
								true
							)
						]
					});
				}, time);
			} else if (value == "community") {
				await inter.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setTitle("🎯 Community Server")
							.setDescription(
								"**> Press the button below or click [here](https://discord.gg/2zezEnMpaZ) to invite me to another server**"
							)
					],
					components: [
						...button("https://discord.gg/2zezEnMpaZ", "🎯", false)
					]
				});

				setTimeout(async () => {
					await inter.editReply({
						components: [
							...button(
								"https://discord.gg/2zezEnMpaZ",
								"🎯",
								true
							)
						]
					});
				}, time);
			}
		});
	}
};
