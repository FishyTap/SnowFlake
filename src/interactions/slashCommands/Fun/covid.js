const { default: axios } = require("axios");
const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "covid",
	description:
		"Shows the result of covid data accumulated from the given queries",
	type: "CHAT_INPUT",
	options: [
		{
			name: "country",
			description: "the country you want to know about",
			type: "STRING",
			required: false
		}
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		const country = interaction.options.getString("country");
		const baseUrl = "https://corona.lmao.ninja/v2";
		let result;

		try {
			const res = await axios.get(
				country ? `${baseUrl}/countries/${country}` : `${baseUrl}/all`
			);
			const { data } = res;
			result = data;
		} catch {
			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(`**Unable to find ${country}**`)
				]
			});
		}

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle(
						country
							? `${country.toString().toUpperCase()} Stats`
							: "Total Corona Cases World Wide"
					)
					.setColor(process.env.SIGHEX)
					.setThumbnail(
						country
							? result.countryInfo.flag
							: "https://i.giphy.com/YPbrUhP9Ryhgi2psz3.gif"
					)
					.addFields(
						{
							name: "Total Cases",
							value: result.cases.toLocaleString(),
							inline: true
						},
						{
							name: "Total Deaths",
							value: result.deaths.toLocaleString(),
							inline: true
						},
						{
							name: "Total Recovered",
							value: result.recovered.toLocaleString(),
							inline: true
						},
						{
							name: "Active Cases",
							value: result.active.toLocaleString(),
							inline: true
						},
						{
							name: "_ _",
							value: "_ _",
							inline: true
						},
						{
							name: "Critical Cases",
							value: result.critical.toLocaleString(),
							inline: true
						},
						{
							name: "Today's Recoveries",
							value: result.todayRecovered
								.toLocaleString()
								.replace("-", ""),
							inline: true
						},
						{
							name: "Today's Deaths",
							value: result.todayDeaths.toLocaleString(),
							inline: true
						}
					)
			]
		});
	}
};
