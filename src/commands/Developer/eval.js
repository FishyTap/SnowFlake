const { Client, Message, MessageEmbed } = require("discord.js");
const { inspect } = require("util");

module.exports = {
	name: "eval",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Evaluates certain code",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let code = args.join(" ");

		if (!code)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription("**You must state some code to run**")
				]
			});

		try {
			const result = await eval(code);
			let output = result;
			if (typeof result !== "string") {
				output = inspect(result);
			}

			message.channel.send({ content: `\`\`\`js\n${output}\n\`\`\`` });
		} catch (err) {
			console.log(err);
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}
	}
};
