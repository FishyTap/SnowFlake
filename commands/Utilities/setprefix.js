const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/guilds");

module.exports = {
	name: "setprefix",
	aliases: [],
	cooldown: 0,
	permissions: ["MANAGE_GUILD"],
	usage: "",
	description: "Sets a new prefix the current guild",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		if (!args[0]) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							"**You must state a new prefix for this guild**"
						)
				]
			});
		}

		let guildId = message.guild.id;
		let prefix = args.join(" ");

		if (prefix.length > 5) {
			return message.channel.send({
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
					prefix
				});

				data.save();

				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.SIGHEX)
							.setDescription(
								`**This guild's prefix is now set to \`${prefix}\`**`
							)
					]
				});
			} else if (!data && prefix === process.env.PREFIX) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**This guild's prefix is already \`${process.env.PREFIX}\`**`
							)
					]
				});
			}

			if (data && prefix === data.prefix) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription(
								`**This guild's prefix is already \`${data.prefix}\`**`
							)
					]
				});
			} else if (data && prefix === process.env.PREFIX) {
				await schema.findOneAndDelete({ guildId });

				return message.channel.send({
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
				prefix
			});

			data.save();

			message.channel.send({
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
