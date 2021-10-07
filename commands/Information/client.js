const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "client",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "",
	description: "Shows the information of the client",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("**Bot Info**")
					.setThumbnail(
						client.user.displayAvatarURL({ dynamic: true })
					).setDescription(`
                        **Username:** ${client.user.username}
						**Tag:** ${client.user.tag}
						**ID:** ${client.user.id}
						**Created:** ${moment(client.user.createdAt).format("DD-MM-YYYY")}
						**Owner:** FishyTap Dev™
                    `)
			]
		});
	}
};
