const {
	Client,
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu
} = require("discord.js");
const { inspect } = require("util");

/**
 *
 * @param {String} string
 * @returns
 */
function trimString(string, length) {
	return string?.length > length
		? string?.substring(0, length - 3) + "..."
		: string;
}

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

		if (!code || code == "")
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription("**You must state some code to run**")
				]
			});

		let embed = new MessageEmbed()
			.setColor(process.env.SIGHEX)
			.addField(
				"📥  Input",
				`\`\`\` ${trimString(code.toString(), 1000)} \`\`\``
			);

		message.delete();

		try {
			try {
				const result = await eval(code);
				let output = result;
				output = trimString(`${inspect(result).toString()}`, 1000);

				message.channel.send({
					embeds: [
						embed
							.addField(
								"📤  Output",
								`\`\`\`cmd\n ${trimString(
									output,
									1000
								)} \n\`\`\``
							)
							.addField("Status", "Success")
					]
				});
			} catch (err) {
				if (err instanceof SyntaxError) {
					message.channel.send({
						embeds: [
							embed
								.addField(
									"📤  Output",
									`\`\`\`cmd\n ${trimString(
										err.toString(),
										1000
									)} \n\`\`\``
								)
								.addField("Status", "Failed")
						]
					});
				} else {
					return;
				}
			}
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
