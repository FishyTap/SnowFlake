const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const moment = require("moment");

module.exports = {
	name: "client",
	description: "Shows the information of the client",
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
