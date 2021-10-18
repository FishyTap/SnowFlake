const {
	Client,
	MessageEmbed,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu
} = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "support",
	description: "Gives the user some support",
	type: "CHAT_INPUT",
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let time = ms("1m");

		let row = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setPlaceholder("Please choose an option")
					.setCustomId("support-menu")
					.addOptions([
						{
							label: "Invite",
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

		await interaction.editReply({
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

		let collector = interaction.channel.createMessageComponentCollector({
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
							.setTitle("🏷 Invite")
							.setDescription(
								"**> Press the button below or click [here](https://www.is.gd/SnowFlake) to invite me to another server**"
							)
					],
					components: [
						...button("https://www.is.gd/SnowFlake", "🏷", false)
					]
				});

				setTimeout(async () => {
					await inter.editReply({
						components: [...button(null, "🏷", true)]
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
						components: [...button(null, "🎯", true)]
					});
				}, time);
			}
		});
	}
};
