const { Client, MessageEmbed } = require("discord.js");
const moment = require("moment");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
	client.on("messageCreate", async (message) => {
		if (!message.guild || message.author.bot) return;

		const mentionedMember = message.mentions.members.first();

		if (mentionedMember) {
			let data = client.afk.get(mentionedMember.id);

			if (data) {
				const [timestamps, reason] = data;

				const timeAgo = moment(timestamps).fromNow();

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								[
									`**${mentionedMember.user.username} is currently afk!**`,
									`**Reason:** ${reason}`,
									`**Time:** ${timeAgo}`
								].join("\n")
							)
					]
				});
			} else return;
		}

		let getData = client.afk.get(message.author.id);
		if (getData) {
			const guildId = getData[2];
			if (message.guild.id !== guildId) return;
			client.afk.delete(message.author.id);

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**<@${message.author.id}> is no longer afk!**`
						)
				]
			});
		}
	});
};
