const { Client, Message, MessageEmbed } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */

module.exports = async (client, message) => {
	const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

	if (message.content.match(mention)) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("🛡 **Who pinged me???**")
					.setDescription(
						`${[
							`**My prefix is \`${client.prefix}\`**`,
							`**Use \`${client.prefix}help\` to attain more information!**`
						].join("\n")}`
					)
			]
		});
	}
};
