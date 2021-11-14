const { Client, MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
	name: "role",
	description: "shows the information of this guilds roles",
	type: "CHAT_INPUT",
	options: [
		{
			name: "input",
			description: "the role you want to see the information of",
			type: "ROLE",
			required: false
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

		let role = interaction.options.getRole("input");

		if (role) {
			let rTarget = interaction.guild.roles.cache.find(
				(r) => r.id === role.id
			);

			let WithRole;

			if (rTarget.members.size > 5)
				WithRole =
					rTarget.members
						.map((e) => `<@${e.id}>`)
						.slice(0, 5)
						.join(", ") +
					` **and ${rTarget.members.size - 5} more...**`;

			if (rTarget.members.size < 5)
				WithRole = rTarget.members
					.map((e) => `<@${e.id}>`)
					.join("**, **");

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(rTarget.color)
						.setAuthor(
							interaction.guild.name,
							interaction.guild.iconURL()
						)
						.setDescription(
							[
								`**Role Name:**  <@&${rTarget.id}>`,
								`**Role ID:** **\`${rTarget.id}\`**`,
								`**Role Mentionable:** **\`${rTarget.mentionable
									.toString()
									.replace("true", "Yes")
									.replace("false", "No")}\`**`,
								`**Role Members Size:** **\`${
									rTarget.members.size || 0
								}\`**`
							].join("\n")
						)
						.addField(
							"Role Members:",
							WithRole ? WithRole : "**`Nobody has this role`**"
						)
				]
			});
		} else {
			let roles = [];
			interaction.guild.roles.cache.map((x) => {
				roles.push(`${x}`);
			});

			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setThumbnail(interaction.guild.iconURL())
						.setTitle(`**Roles in *${interaction.guild.name}***`)
						.setDescription(
							[
								`**-------------------------------------------------------------------------------**`,
								`${roles.join("**, **")}`
							].join("\n")
						)
				]
			});
		}
	}
};
