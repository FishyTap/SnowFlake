const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "lockdown",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_CHANNELS"],
	usage: "<true/false>",
	description: "Sets the lockdown of the current channel",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		try {
			const role = message.guild.roles.everyone;

			if (!args.length) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**You must state a query to identify whether to lock or unlock this channel**"
							)
					]
				});
			}

			let query = args[0].toLowerCase();

			if (!["true", "false"].includes(query)) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Invalid Query**")
					]
				});
			}

			const perms = role.permissions.toArray();

			if (query === "false") {
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
			} else if (query === "true") {
				const newPerms = perms.filter(
					(perm) => perm !== "SEND_MESSAGES"
				);
				await role.edit({ permissions: newPerms });

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Successfully Locked This Channel**"
							)
					]
				});
			}
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
