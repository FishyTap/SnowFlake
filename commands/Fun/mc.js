const { Client, Message, MessageEmbed } = require("discord.js");
const mc = require("minecraft-server-util");

module.exports = {
	name: "mcserver",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<host> <port>",
	description: "Shows the status of a server",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args[0] || !args[1]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Command: -mc <host> <port>")
				]
			});
		}
		mc(`${args[0]}`, parseInt(args[1]), (err, res) => {
			if (err) throw err;
			message.channel.send({
				embeds: [
					new MessageEmbed().setColor("RANDOM").setDescription(`
                            **SERVER STATUS**
                            **Server Host **
                            ${res.host}
                            **Server Port **
                            ${res.port}
                            **Server Version **
                            ${res.version}
                            **Online Players **
                            ${res.onlinePlayers}
                            **Max Players **
                            ${res.maxPlayers}
                        `)
				]
			});
		});
	}
};
