const {
	Client,
	Collection,
	CommandInteraction,
	MessageEmbed
} = require("discord.js");
const cooldown = new Map();

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
		if (!command) {
			await interaction.deferReply({
				ephemeral: true
			});
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**An Error Occured**")
				]
			});
		}

		interaction.member = interaction.guild.members.cache.get(
			interaction.user.id
		);

		if (!cooldown.has(command.name)) {
			cooldown.set(command.name, new Collection());
		}

		const current_time = Date.now();
		const time_stamps = cooldown.get(command.name);
		const cooldown_amount = command.cooldown * 1000;

		if (time_stamps.has(interaction.user.id)) {
			const expiration_time =
				time_stamps.get(interaction.user.id) + cooldown_amount;
			if (current_time < expiration_time) {
				await interaction.deferReply({
					ephemeral: true
				});

				const time_left = (expiration_time - current_time) / 1000;
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**Please wait \`${time_left.toFixed(
									1
								)} seconds\` between each cooldown**`
							)
					]
				});
			}
		}

		time_stamps.set(interaction.user.id, current_time);

		setTimeout(
			() => time_stamps.delete(interaction.user.id),
			cooldown_amount
		);

		if (!interaction.member.permissions.has(command.permissions || [])) {
			return interaction.followUp({
				content:
					"You don't have the required permissions to use this command"
			});
		}

		command.callbacks(client, interaction);
	}

	// Context Menu
	if (interaction.isContextMenu()) {
		if (command) command.callbacks(client, interaction);
	}
};
