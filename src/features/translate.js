const { Client, MessageEmbed, Util } = require("discord.js");
const DL = require("detectlanguage");
const detectLanguage = new DL("53c19b5a229a6f9f6805e3a4e62d54da"); // "c42820ee777e3f8144765a493ea25283"
const translate = require("@iamtraction/google-translate");
const isoCoverter = require("iso-language-converter");
const schema = require("../mongo/schemas/guilds");
const { create } = require("../mongo/functions/guilds/create");
/**
 *
 * @param {Client} client
 */

module.exports = client => {
	client.on("messageCreate", async message => {
		let data = await schema.findOne({ guildId: message.guild.id });

		if (!data) data = await create(client, message.guild.id);

		if (data.features.autoTranslate == "false") return;

		try {
			if (message.author.bot) return;

			let defaultLanguage = "English";
			let emoji = client.emojis.cache.get("902547014452146176");

			const result = await translate(message, {
				to: defaultLanguage
			}).catch(() => {});

			let convertedText = isoCoverter(
				result?.from?.language?.iso || "en"
			);

			const args = message.content.split(/ +/);
			let counter = 0;

			for (let i = 0; i < args.length; i++) {
				let arg = Util.parseEmoji(args[i]);

				if (arg.id !== null) break;

				let res = await detectLanguage?.detect(args[i]);

				let code = JSON.stringify(res[0]?.language);

				if (!code) code = "en";

				if (convertedText != defaultLanguage || null) counter++;
			}

			if (counter >= 1) {
				await message.react(emoji);

				let filter = reaction => reaction.emoji.name == emoji.name;

				let collector = message.createReactionCollector({
					filter,
					max: 1
				});

				collector.on("collect", async reaction => {
					reaction.users.remove();

					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setAuthor(
									message.author.tag,
									message.author.displayAvatarURL({
										dynamic: true
									})
								)
								.setDescription(`${result?.text}`)
								.setFooter(`Translated from ${convertedText}`)
								.setTimestamp()
						]
					});
				});
			} else {
				return;
			}
		} catch (error) {
			return;
		}
	});
};
