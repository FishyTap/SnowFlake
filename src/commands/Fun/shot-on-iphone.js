const { default: axios } = require("axios");
const { Client, Message } = require("discord.js");

module.exports = {
	name: "shotoniphone",
	aliases: ["soi"],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Fetches a random Shot On Iphone meme",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let { data } = await axios
			.get(`https://shot-on-iphone.studio/api/video`)
			.catch(() => {});

		message.channel.send({
			content: data?.url
		});
	}
};
