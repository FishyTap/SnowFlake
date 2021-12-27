const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "timeout",
	description: "Timeouts a user",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_GUILD"],
	options: [
		{
			name: "target",
			description: "the target you want to timeout",
			type: "USER",
			required: true
		},
		{
			name: "time",
			description: "the time you want to timeout",
			type: "STRING",
			required: true
		},
		{
			name: "reason",
			description: "the reason you want to timeout",
			type: "STRING",
			required: true
		}
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let target = interaction.options.getUser("target");
			let time = interaction.options.getString("time");
			let reason = interaction.options.getString("reason");

			const member = interaction.guild.members.cache.get(target.id);

			let args = time.split(/[ ]+/);
			time = 0;

			for (let i = 0; i < args.length; i++) {
				time += ms(args[i]);
			}

			if (time > ms("7d")) {
				return interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Timeout time must not exceed `7 days`**"
							)
					]
				});
			}

			if (time < ms("1m")) {
				return interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								"**Timeout time must exceed `60 seconds`**"
							)
					]
				});
			}

			try {
				member.timeout(time, reason);

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**Successfully timeout ${member}**`
							)
					]
				});
			} catch {
				return;
			}
		} catch (err) {
			console.log(err);
			interaction.followUp({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}
	}
};
