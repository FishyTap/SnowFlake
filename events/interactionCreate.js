const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @returns
 */

module.exports = async (client, interaction) => {
	const command = client.interactions.get(interaction.commandName);

	// Slash Command
	if (interaction.isCommand()) {
		if (!command)
			return interaction.followUp({
				content: "An Error Occured"
			});

		const args = [];
		for (let option of interaction.options.data) {
			if (option.type === "SUB_COMMAND") {
				if (option.name) args.push(option.name);

				option.options.forEach((x) => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) args.push(option.value);
		}

		interaction.member = interaction.guild.members.cache.get(
			interaction.user.id
		);

		if (!interaction.member.permissions.has(command.permissions || [])) {
			return interaction.followUp({
				content:
					"You don't have the required permissions to use this command"
			});
		}

		command.callbacks(client, interaction, args);
	}

	// Context Menu
	if (interaction.isContextMenu()) {
		if (command) command.callbacks(client, interaction);
	}
};
