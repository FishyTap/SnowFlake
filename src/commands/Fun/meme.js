const { default: axios } = require("axios");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "meme",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Fetches a random meme",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let url = "https://www.reddit.com/r/memes/random/.json";
		let result;

		try {
			result = await axios.get(url);
		} catch {
			return;
		}

		if (!result || !result?.data || !result?.data?.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}

		result = result?.data[0]?.data?.children[0]?.data;

		message.channel.send({
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
