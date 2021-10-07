const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
	client.on("messageDelete", async (message) => {
		let snipes = client.snipes.get(message.channel.id) || [];

		if (snipes.length > 20) snipes = snipes.slice(0, 21);

		snipes.unshift({
			msg: message,
			attachments: message.attachments.first()?.proxyURL || null,
			timestamps: Date.now()
		});

		client.snipes.set(message.channel.id, snipes);
	});
};
