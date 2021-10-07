const { Client, Message } = require("discord.js");
const schema = require("../../mongo/schemas/users");

module.exports = {
	name: "deleteplaylist",
	aliases: ["dpl"],
	cooldown: 0,
	permissions: [],
	usage: "<none>",
	description: "",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let data = await schema.findOne({ userId: message.author.id });

		if (!data) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must create a playlist before being able to manage it**"
						)
				]
			});
		} else if (data) {
			await schema.findOneAndDelete({ userId: message.author.id });

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**Successfully deleted your playlist**`
						)
				]
			});
		}
	}
};
