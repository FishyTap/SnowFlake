const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../../mongo/schemas/guilds");

module.exports = {
	name: "setprefix",
	description: "Sets a new prefix the current guild",
	type: "CHAT_INPUT",
	permissions: ["MANAGE_GUILD"],
	options: [
		{
			name: "newprefix",
			description: "the new prefix for this guild",
			type: "STRING",
			required: true
		}
	],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		let newprefix = interaction.options.getString("newprefix");

		if (!newprefix) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state a new prefix for this guild**"
						)
				]
			});
		}

		let guildId = interaction.guildId;
		let prefix = newprefix;

		if (prefix.length > 5) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Your new prefix is too long**")
				]
			});
		}

		schema.findOne({ guildId }, async (err, data) => {
			if (err) throw err;

			if (!data && prefix !== process.env.PREFIX) {
				data = new schema({
					guildId,
					config: {
						prefix
					}
				});

				data.save();

				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**This guild's prefix is now set to \`${prefix}\`**`
							)
					]
				});
			} else if (!data && prefix === process.env.PREFIX) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**This guild's prefix is already \`${process.env.PREFIX}\`**`
							)
					]
				});
			}

			if (data && prefix === data.config.prefix) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**This guild's prefix is already \`${data.config.prefix}\`**`
							)
					]
				});
			} else if (data && prefix === process.env.PREFIX) {
				await schema.findOneAndDelete({ guildId });

				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**This guild's prefix has been updated to \`${prefix}\`**`
							)
					]
				});
			}

			await schema.findOneAndDelete({ guildId });

			data = new schema({
				guildId,
				config: {
					prefix
				}
			});

			data.save();

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setDescription(
							`**This guild's prefix has been updated to \`${prefix}\`**`
						)
				]
			});
		});
	}
};
