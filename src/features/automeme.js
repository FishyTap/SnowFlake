const { Client, MessageEmbed } = require("discord.js");
const { default: axios } = require("axios");
const ms = require("ms");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
	// return;
	let timer = ms("10s");

	setInterval(async () => {
		try {
			let guild = client?.guilds?.cache?.get("797709775898542110");
			let channel = guild?.channels?.cache?.get("907587831831068674");

			let categories = ["hentai", "ecchi", "sex"];
			let value = Number(
				Math.floor(Math.random() * (Number(categories.length) - 1)) + 0
			);
			let result;
			let url = `https://www.reddit.com/r/${categories[value]}/random/.json`;

			try {
				result = await axios.get(url);
			} catch {
				return channel?.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**An Error Occured**")
					]
				});
			}

			if (!result || !result?.data || !result?.data?.length) {
				return channel?.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**An Error Occured**")
					]
				});
			}

			result = result?.data[0]?.data?.children[0]?.data;

			channel?.send({
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
								result?.num_comments
									? result?.num_comments
									: "0"
							}`
						)
				]
			});
		} catch {
			return;
		}
	}, timer);
};
