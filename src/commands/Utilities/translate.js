const { Client, Message, MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
	name: "translate",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<query>",
	description: "Translate whatever query provided",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		const defaultLanguage = "English";
		let query = args.join(" ");

		let result;

		try {
			result = await translate(query, {
				to: defaultLanguage.toLowerCase()
			}).catch(() => {});
		} catch (err) {
			console.log(err);
		}

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setAuthor(
						message.author.tag,
						message.author.displayAvatarURL({
							dynamic: true
						})
					)
					.setDescription(`${result?.text ? result?.text : query}`)
					.setTimestamp()
			]
		});
	}
};
