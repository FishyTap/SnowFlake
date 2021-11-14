const {
	Client,
	MessageEmbed,
	ContextMenuInteraction,
	Util
} = require("discord.js");
const DL = require("detectlanguage");
const detectLanguage = new DL("c42820ee777e3f8144765a493ea25283"); // "53c19b5a229a6f9f6805e3a4e62d54da"
const translate = require("@iamtraction/google-translate");
const isoCoverter = require("iso-language-converter");

module.exports = {
	name: "Translate",
	type: "MESSAGE",
	/**
	 *
	 * @param {Client} client
	 * @param {ContextMenuInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		try {
			let msg = await interaction.channel.messages.fetch(
				interaction.targetId
			);

			let defaultLanguage = "English";

			const result = await translate(msg.content, {
				to: defaultLanguage
			}).catch(() => {});

			let convertedText = isoCoverter(
				result?.from?.language?.iso || "en"
			);

			const args = msg.content.split(/ +/);

			for (let i = 0; i < args.length; i++) {
				let arg = Util.parseEmoji(args[i]);

				if (arg.id !== null) break;

				let res = await detectLanguage?.detect(args[i]);

				let code = JSON.stringify(res[0]?.language);

				if (!code) code = "en";
			}

			interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.SIGHEX)
						.setAuthor(
							msg.author.tag,
							msg.author.displayAvatarURL({
								dynamic: true
							})
						)
						.setDescription(`${result?.text}`)
						.setFooter(`Translated from ${convertedText}`)
						.setTimestamp()
				]
			});
		} catch {
			return;
		}
	}
};
