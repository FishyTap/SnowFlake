const {
	Message,
	MessageEmbed,
	MessageButton,
	MessageActionRow
} = require("discord.js");
const chalk = require("chalk");

/**
 *
 * @param {Message} message
 * @param {MessageEmbed[]} pages
 * @param {Array} buttons
 * @returns
 */

const Pagination = async (message, pages, buttons, timeOut, required, bool) => {
	!bool ? (bool = "message") : bool;

	if (bool === "message") {
		if (!message)
			throw new Error(chalk.bold.red("Missing Message Argument"));
		if (!pages) throw new Error(chalk.bold.red("Missing Pages Argument"));

		if (!buttons || buttons === null) {
			buttons = [[], [], [], []];

			buttons[0][0] = "⏮";
			buttons[0][1] = "SECONDARY";

			buttons[1][0] = "◀️";
			buttons[1][1] = "SECONDARY";

			buttons[2][0] = "▶️";
			buttons[2][1] = "SECONDARY";

			buttons[3][0] = "⏭";
			buttons[3][1] = "SECONDARY";
		}

		if (buttons[0]) {
			!buttons[0][0] || buttons[0][0] === null
				? (buttons[0][0] = "⏮")
				: buttons[0][0];
			!buttons[0][1] || buttons[0][1] === null
				? (buttons[0][1] = "SECONDARY")
				: buttons[0][1];
		} else if (!buttons[0] || buttons[0] === null) {
			buttons[0][0] = "⏮";
			buttons[0][1] = "SECONDARY";
		}

		if (buttons[1]) {
			!buttons[1][0] || buttons[1][0] === null
				? (buttons[1][0] = "◀️")
				: buttons[1][0];
			!buttons[1][1] || buttons[1][1] === null
				? (buttons[1][1] = "SECONDARY")
				: buttons[1][1];
		} else if (!buttons[1] || buttons[1] === null) {
			buttons[1][0] = "◀️";
			buttons[1][1] = "SECONDARY";
		}

		if (buttons[2]) {
			!buttons[2][0] || buttons[2][0] === null
				? (buttons[2][0] = "▶️")
				: buttons[2][0];
			!buttons[2][1] || buttons[2][1] === null
				? (buttons[2][1] = "SECONDARY")
				: buttons[2][1];
		} else if (!buttons[2] || buttons[2] === null) {
			buttons[2][0] = "▶️";
			buttons[2][1] = "SECONDARY";
		}

		if (buttons[3]) {
			!buttons[3][0] || buttons[3][0] === null
				? (buttons[3][0] = "▶️")
				: buttons[3][0];
			!buttons[3][1] || buttons[3][1] === null
				? (buttons[3][1] = "SECONDARY")
				: buttons[3][1];
		} else if (!buttons[3] || buttons[3] === null) {
			buttons[3][0] = "⏭";
			buttons[3][1] = "SECONDARY";
		}

		!timeOut || timeOut === null ? (timeOut = 60000) : timeOut;

		if (!required) {
			required[0] = true;
			required[1] = true;
		} else if (!required[0] && required[1]) {
			required[0] = false;
			required[1] = true;
		} else if (required[0] && !required[1]) {
			required[0] = true;
			required[1] = false;
		} else if (!required[0] && !required[1]) {
			required[0] = false;
			required[1] = false;
		}

		const styles = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"];

		for (let i = 0; i < buttons.length; i++) {
			if (!styles.includes(buttons[i][1]))
				throw new SyntaxError(chalk.bold.red("Invalid Button Style"));

			if (buttons[i][1] === "LINK")
				throw new SyntaxError(
					chalk.bold.red("A Link Button Can't Be Used For Pagination")
				);
		}

		// Rows And Pagination

		let index = 0;
		let row;

		if (required[0] === false && required[1] === false) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][1])
					.setCustomId("1")
			);
		} else if (required[0] === true && required[1] === true) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[0][1])
					.setLabel(buttons[0][0])
					.setCustomId("-2"),

				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1"),

				new MessageButton()
					.setStyle(buttons[3][1])
					.setLabel(buttons[3][0])
					.setCustomId("2")
			);
		} else if (required[0] === false && required[1] === true) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1"),

				new MessageButton()
					.setStyle(buttons[3][1])
					.setLabel(buttons[3][0])
					.setCustomId("2")
			);
		} else if (required[0] === true && required[1] === false) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[0][1])
					.setLabel(buttons[0][0])
					.setCustomId("-2"),

				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1")
			);
		}

		if (pages.length > 1) {
			row.components.forEach((x) => x.setDisabled(false));
			let msg = message.channel
				.send({
					embeds: [
						pages[0].setFooter(`Page ${index + 1}/${pages.length}`)
					],
					components: [row]
				})
				.then(async (Msg) => {
					const ifilter = (i) => i.user.id === message.author.id;

					const collector = Msg.createMessageComponentCollector({
						filter: ifilter,
						time: timeOut
					});

					collector.on("collect", async (interaction) => {
						if (interaction.customId === "-2") {
							index = 0;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "-1") {
							index = index > 0 ? --index : pages.length - 1;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "1") {
							index = index + 1 < pages.length ? ++index : 0;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "2") {
							index = pages.length - 1;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						}
					});

					collector.on("end", async (interaction) => {
						await row.components.forEach((x) =>
							x.setDisabled(true)
						);

						await interaction.deferUpdate();

						await interaction.editReply({
							components: [row]
						});
					});
				});
			return msg;
		} else {
			row.components.forEach((x) => x.setDisabled(true));
			let msg = message.channel.send({
				embeds: [pages[0]],
				components: [row]
			});
			return msg;
		}
	} else if (bool === "interaction") {
		if (!message)
			throw new Error(chalk.bold.red("Missing Interaction Argument"));
		if (!pages) throw new Error(chalk.bold.red("Missing Pages Argument"));

		if (!buttons || buttons === null) {
			buttons = [[], [], [], []];

			buttons[0][0] = "⏮";
			buttons[0][1] = "SECONDARY";

			buttons[1][0] = "◀️";
			buttons[1][1] = "SECONDARY";

			buttons[2][0] = "▶️";
			buttons[2][1] = "SECONDARY";

			buttons[3][0] = "⏭";
			buttons[3][1] = "SECONDARY";
		}

		if (buttons[0]) {
			!buttons[0][0] || buttons[0][0] === null
				? (buttons[0][0] = "⏮")
				: buttons[0][0];
			!buttons[0][1] || buttons[0][1] === null
				? (buttons[0][1] = "SECONDARY")
				: buttons[0][1];
		} else if (!buttons[0] || buttons[0] === null) {
			buttons[0][0] = "⏮";
			buttons[0][1] = "SECONDARY";
		}

		if (buttons[1]) {
			!buttons[1][0] || buttons[1][0] === null
				? (buttons[1][0] = "◀️")
				: buttons[1][0];
			!buttons[1][1] || buttons[1][1] === null
				? (buttons[1][1] = "SECONDARY")
				: buttons[1][1];
		} else if (!buttons[1] || buttons[1] === null) {
			buttons[1][0] = "◀️";
			buttons[1][1] = "SECONDARY";
		}

		if (buttons[2]) {
			!buttons[2][0] || buttons[2][0] === null
				? (buttons[2][0] = "▶️")
				: buttons[2][0];
			!buttons[2][1] || buttons[2][1] === null
				? (buttons[2][1] = "SECONDARY")
				: buttons[2][1];
		} else if (!buttons[2] || buttons[2] === null) {
			buttons[2][0] = "▶️";
			buttons[2][1] = "SECONDARY";
		}

		if (buttons[3]) {
			!buttons[3][0] || buttons[3][0] === null
				? (buttons[3][0] = "▶️")
				: buttons[3][0];
			!buttons[3][1] || buttons[3][1] === null
				? (buttons[3][1] = "SECONDARY")
				: buttons[3][1];
		} else if (!buttons[3] || buttons[3] === null) {
			buttons[3][0] = "⏭";
			buttons[3][1] = "SECONDARY";
		}

		!timeOut || timeOut === null ? (timeOut = 60000) : timeOut;

		if (!required) {
			required[0] = true;
			required[1] = true;
		} else if (!required[0] && required[1]) {
			required[0] = false;
			required[1] = true;
		} else if (required[0] && !required[1]) {
			required[0] = true;
			required[1] = false;
		} else if (!required[0] && !required[1]) {
			required[0] = false;
			required[1] = false;
		}

		const styles = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"];

		for (let i = 0; i < buttons.length; i++) {
			if (!styles.includes(buttons[i][1]))
				throw new SyntaxError(chalk.bold.red("Invalid Button Style"));

			if (buttons[i][1] === "LINK")
				throw new SyntaxError(
					chalk.bold.red("A Link Button Can't Be Used For Pagination")
				);
		}

		// Rows And Pagination

		let index = 0;
		let row;

		if (required[0] === false && required[1] === false) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][1])
					.setCustomId("1")
			);
		} else if (required[0] === true && required[1] === true) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[0][1])
					.setLabel(buttons[0][0])
					.setCustomId("-2"),

				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1"),

				new MessageButton()
					.setStyle(buttons[3][1])
					.setLabel(buttons[3][0])
					.setCustomId("2")
			);
		} else if (required[0] === false && required[1] === true) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1"),

				new MessageButton()
					.setStyle(buttons[3][1])
					.setLabel(buttons[3][0])
					.setCustomId("2")
			);
		} else if (required[0] === true && required[1] === false) {
			row = new MessageActionRow().addComponents(
				new MessageButton()
					.setStyle(buttons[0][1])
					.setLabel(buttons[0][0])
					.setCustomId("-2"),

				new MessageButton()
					.setStyle(buttons[1][1])
					.setLabel(buttons[1][0])
					.setCustomId("-1"),

				new MessageButton()
					.setStyle(buttons[2][1])
					.setLabel(buttons[2][0])
					.setCustomId("1")
			);
		}

		if (pages.length > 1) {
			row.components.forEach((x) => x.setDisabled(false));
			let msg = message
				.editReply({
					embeds: [
						pages[0].setFooter(`Page ${index + 1}/${pages.length}`)
					],
					components: [row]
				})
				.then(async (Msg) => {
					const ifilter = (i) => i.user.id === message.user.id;

					const collector = Msg.createMessageComponentCollector({
						filter: ifilter,
						time: timeOut
					});

					collector.on("collect", async (interaction) => {
						if (interaction.customId === "-2") {
							index = 0;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "-1") {
							index = index > 0 ? --index : pages.length - 1;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "1") {
							index = index + 1 < pages.length ? ++index : 0;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						} else if (interaction.customId === "2") {
							index = pages.length - 1;

							await interaction.deferUpdate();

							await interaction.editReply({
								embeds: [
									pages[index].setFooter(
										`Page ${index + 1}/${pages.length}`
									)
								]
							});
						}
					});

					collector.on("end", async (interaction) => {
						await row.components.forEach((x) =>
							x.setDisabled(true)
						);

						await interaction.deferUpdate();

						await interaction.editReply({
							components: [row]
						});
					});
				});
			return msg;
		} else {
			row.components.forEach((x) => x.setDisabled(true));
			let msg = message.editReply({
				embeds: [pages[0]],
				components: [row]
			});
			return msg;
		}
	} else {
		throw new Error(chalk.bold.red("Invalid Argument"));
	}
};

module.exports = { Pagination };
