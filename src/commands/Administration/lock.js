const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "lock",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_CHANNELS"],
	usage: "",
	description: "Locks the current channel",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		try {
			const role = message.guild.roles.everyone;
			const perms = role.permissions.toArray();
			const newPerms = perms.filter((perm) => perm !== "SEND_MESSAGES");
			await role.edit({ permissions: newPerms });

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Successfully Locked This Channel**")
				]
			});
		} catch {
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
