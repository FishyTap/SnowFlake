const { default: axios } = require("axios");
const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "meme",
	description: "Fetches a random meme",
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

		let url = "https://www.reddit.com/r/memes/random/.json";
		let result;

		try {
			result = await axios.get(url);
		} catch {
			return;
		}

		if (!result || !result?.data || !result?.data?.length) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}

		result = result?.data[0]?.data?.children[0]?.data;

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle(result?.title)
					.setImage(result?.url)
					.setURL(`https://www.reddit.com${result?.permalink}`)
					.setFooter(
						`👍 ${result?.ups ? result?.ups : "0"}  |  👎 ${
							result?.downs ? result?.downs : "0"
						}  |  💬 ${
							result?.num_comments ? result?.num_comments : "0"
						}`
					)
			]
		});
	}
};
