const {
	Client,
	MessageEmbed,
	CommandInteraction,
	Collection
} = require("discord.js");
const schema = require("../../../mongo/schemas/users");

module.exports = {
	name: "rich",
	description: "Shows the top 5 richest users in the server",
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

		const collection = new Collection();

		await Promise.all(
			interaction.guild.members.cache.map(async (member) => {
				if (member.user.bot) return;
				let id = member.id;

				let data = await schema.findOne({ userId: id });
				if (!data) return;

				let money = Number(data.economy.wallet);

				return money != 0
					? collection.set(id, {
							id,
							money
					  })
					: null;
			})
		);

		let richest = collection.sort((a, b) => b.money - a.money).first(5);

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle(`Richest users in ${interaction.guild.name}`)
					.setDescription(
						`${richest
							.map((value, index) => {
								return `**\`${
									index + 1
								}.\`** **${value?.money?.toLocaleString()}** - ${
									client.users.cache.get(value?.id)?.tag
								}`;
							})
							.join("\n")}`
					)
			]
		});
	}
};
