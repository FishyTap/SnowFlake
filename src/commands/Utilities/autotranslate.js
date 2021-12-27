const { Client, Message, MessageEmbed } = require("discord.js");
const schema = require("../../mongo/schemas/guilds");
const { create } = require("../../mongo/functions/guilds/create");

module.exports = {
	name: "autoTranslate",
	aliases: ["autoT"],
	cooldown: 0,
	permissions: ["MANAGE_MESSAGES"],
	usage: "",
	description: "Toggles the autoTranslate feature",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		let data = await schema.findOne({ guildId: message.guild.id });

		if (!data) data = create(client, message.guild.id);

        try {
            if (data?.features?.autoTranslate === "false") {
                data?.features?.autoTranslate = "true";
                await data.save()

                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(process.env.SIGHEX)
                            .setDescription("**AutoTranslate is now `enabled`**")
                    ]
            });
            } else if (data?.features?.autoTranslate === "true") {
                data?.features?.autoTranslate = "false";
                await data.save()

                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(process.env.SIGHEX)
                            .setDescription("**AutoTranslate is now `disabled`**")
                    ]
            });
            }
        } catch {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(process.env.REDHEX)
                        .setDescription("**An Error Occured**")
                ]
            });
        }
	}
};
