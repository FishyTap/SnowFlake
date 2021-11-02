const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "unlock",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_CHANNELS"],
	usage: "",
	description: "Unlocks the current channel",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		try {
			const role = message.guild.roles.everyone;
			const perms = role.permissions.toArray();
			perms.push("SEND_MESSAGES");
			await role.edit({ permissions: perms });

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**Successfully Unlocked This Channel**"
						)
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
