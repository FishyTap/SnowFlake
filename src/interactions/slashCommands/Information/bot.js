const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

const uptime = (c) => {
	let seconds = Math.floor(c.uptime / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);
	let years = Math.floor(days / 365);

	seconds %= 60;
	minutes %= 60;
	hours %= 24;
	days %= 365;

	let s = `${seconds <= 1 ? `${seconds} second` : `${seconds} seconds`}`;
	let m = `${
		minutes <= 1
			? `${minutes == 1 ? `${minutes} minute` : `0 minute`}`
			: `${minutes} minutes`
	}`;
	let h = `${
		hours <= 1
			? `${hours == 1 ? `${hours} hour` : `0 hour`}`
			: `${hours} hours`
	}`;
	let d = `${
		days <= 1 ? `${days == 1 ? `${days} day` : `0 day`}` : `${days} days`
	}`;
	let y = `${
		years <= 1
			? `${years == 1 ? `${years} year` : `0 year`}`
			: `${years} years`
	}`;

	return [y, d, m, h, s];
};

module.exports = {
	name: "bot",
	description: "Shows the information of the bot",
	type: "CHAT_INPUT",
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(process.env.SIGHEX)
					.setTitle("Bot Staistics")
					.setThumbnail(
						client.user.displayAvatarURL({ dynamic: true })
					)
					.addFields([
						{
							name: "**  Username**",
							value: `**\` ${client.user.username} \`**`,
							inline: true
						},
						{
							name: "**         Creator**",
							value: `**\` ${client.owner.username} \`**`,
							inline: true
						},
						{
							name: "** Memory Usage**",
							value: `**ㅤ\` ${
								Math.round(
									(process.memoryUsage().heapUsed /
										1024 /
										1024) *
										100
								) / 100
							} MB \`**`,
							inline: true
						},
						{
							name: "**  Uptime**",
							value: `**\`\`\`css\n${uptime(client).join(
								" "
							)}\n\`\`\`**`
						}
					])
			]
		});
	}
};
