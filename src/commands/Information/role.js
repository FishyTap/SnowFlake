const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "role",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<optional: role>",
	description: "Shows the information of this guilds roles",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let role;

		if (!args[0]) {
			let roles = [];
			message.guild.roles.cache.map((x) => {
				roles.push(`${x}`);
			});

			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setThumbnail(message.guild.iconURL())
						.setTitle(`**Roles in *${message.guild.name}***`)
						.setDescription(
							[
								`**-------------------------------------------------------------------------------**`,
								`${roles.join("**, **")}`
							].join("\n")
						)
				]
			});
		} else if (args[0]) {
			role =
				message.mentions.roles.first() ||
				message.guild.roles.cache.find((r) => r.id === args[0]);

			if (!role) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Unable to find the role with the given query**"
							)
					]
				});
			}
		}

		let WithRole;

		if (role.members.size > 5) {
			WithRole =
				role.members
					.map((e) => `<@${e.id}>`)
					.slice(0, 5)
					.join("**, **") +
				` **and ${role.members.size - 5} more...**`;
		}

		if (role.members.size < 5) {
			WithRole = role.members.map((e) => `<@${e.id}>`).join("**, **");
		}

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(role.color)
					.setThumbnail(message.guild.iconURL())
					.setDescription(
						[
							`**Role Name:**  <@&${role.id}>`,
							`**Role ID:** **\`${role.id}\`**`,
							`**Role Mentionable:** **\`${role.mentionable
								.toString()
								.replace("true", "Yes")
								.replace("false", "No")}\`**`,
							`**Role Members Size:** **\`${
								role.members.size || 0
							}\`**`
						].join("\n")
					)
					.addField(
						"Role Members:",
						WithRole ? WithRole : "**`Nobody has this role`**"
					)
			]
		});
	}
};
