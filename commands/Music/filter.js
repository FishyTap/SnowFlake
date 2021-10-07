const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "filter",
	aliases: ["equalizer"],
	cooldown: 0,
	permissions: [],
	usage: "<party/bass/radio/pop/trablebass/soft/custom/none>",
	description: "Sets the filter/equalizer",
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	callbacks: async (client, message, args) => {
		var player = message.client.manager.get(message.guild.id);

		if (!player) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**There are no players currently**")
				]
			});
		} else if (!message.member.voice.channel) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must be in a voice channel**")
				]
			});
		} else if (
			player &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription(
							`**You must be in the same voice channel as ${message.client.user}**`
						)
				]
			});
		} else {
			let thing = new MessageEmbed();

			if (!args[0] || args[0].toLowerCase() == "none") {
				thing
					.setDescription("**The filter is now set to `none`**")
					.setColor(process.env.SIGHEX);
				player.clearEQ();
				player.filter = "none";
			} else if (args[0].toLowerCase() == "party") {
				var bands = [
					{ band: 0, gain: -1.16 },
					{ band: 1, gain: 0.28 },
					{ band: 2, gain: 0.42 },
					{ band: 3, gain: 0.5 },
					{ band: 4, gain: 0.36 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: -0.3 },
					{ band: 7, gain: -0.21 },
					{ band: 8, gain: -0.21 }
				];
				thing
					.setDescription("**The filter is now set to `party`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "party";
			} else if (args[0].toLowerCase() == "bass") {
				var bands = [
					{ band: 0, gain: 0.6 },
					{ band: 1, gain: 0.7 },
					{ band: 2, gain: 0.8 },
					{ band: 3, gain: 0.55 },
					{ band: 4, gain: 0.25 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: -0.25 },
					{ band: 7, gain: -0.45 },
					{ band: 8, gain: -0.55 },
					{ band: 9, gain: -0.7 },
					{ band: 10, gain: -0.3 },
					{ band: 11, gain: -0.25 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `bass`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "bass";
			} else if (args[0].toLowerCase() == "radio") {
				var bands = [
					{ band: 0, gain: 0.65 },
					{ band: 1, gain: 0.45 },
					{ band: 2, gain: -0.45 },
					{ band: 3, gain: -0.65 },
					{ band: 4, gain: -0.35 },
					{ band: 5, gain: 0.45 },
					{ band: 6, gain: 0.55 },
					{ band: 7, gain: 0.6 },
					{ band: 8, gain: 0.6 },
					{ band: 9, gain: 0.6 },
					{ band: 10, gain: 0 },
					{ band: 11, gain: 0 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `radio`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "radio";
			} else if (args[0].toLowerCase() == "pop") {
				var bands = [
					{ band: 0, gain: -0.25 },
					{ band: 1, gain: 0.48 },
					{ band: 2, gain: 0.59 },
					{ band: 3, gain: 0.72 },
					{ band: 4, gain: 0.56 },
					{ band: 5, gain: 0.15 },
					{ band: 6, gain: -0.24 },
					{ band: 7, gain: -0.24 },
					{ band: 8, gain: -0.16 },
					{ band: 9, gain: -0.16 },
					{ band: 10, gain: 0 },
					{ band: 11, gain: 0 },
					{ band: 12, gain: 0 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `pop`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "pop";
			} else if (args[0].toLowerCase() == "trablebass") {
				var bands = [
					{ band: 0, gain: 0.6 },
					{ band: 1, gain: 0.67 },
					{ band: 2, gain: 0.67 },
					{ band: 3, gain: 0 },
					{ band: 4, gain: -0.5 },
					{ band: 5, gain: 0.15 },
					{ band: 6, gain: -0.45 },
					{ band: 7, gain: 0.23 },
					{ band: 8, gain: 0.35 },
					{ band: 9, gain: 0.45 },
					{ band: 10, gain: 0.55 },
					{ band: 11, gain: 0.6 },
					{ band: 12, gain: 0.55 },
					{ band: 13, gain: 0 },
					{ band: 14, gain: 0 }
				];
				thing
					.setDescription("**The filter is now set to `trablebass`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "trablebass";
			} else if (args[0].toLowerCase() == "bassboost") {
				var bands = new Array(7)
					.fill(null)
					.map((_, i) => ({ band: i, gain: 0.25 }));
				thing
					.setDescription("**The filter is now set to `bassboost`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "bassboost";
			} else if (args[0].toLowerCase() == "soft") {
				var bands = [
					{ band: 0, gain: 0 },
					{ band: 1, gain: 0 },
					{ band: 2, gain: 0 },
					{ band: 3, gain: 0 },
					{ band: 4, gain: 0 },
					{ band: 5, gain: 0 },
					{ band: 6, gain: 0 },
					{ band: 7, gain: 0 },
					{ band: 8, gain: -0.25 },
					{ band: 9, gain: -0.25 },
					{ band: 10, gain: -0.25 },
					{ band: 11, gain: -0.25 },
					{ band: 12, gain: -0.25 },
					{ band: 13, gain: -0.25 },
					{ band: 14, gain: -0.25 }
				];
				thing
					.setDescription("**The filter is now set to `soft`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "soft";
			} else if (args[0].toLowerCase() == "custom") {
				var bands = [
					{ band: 0, gain: args[1] },
					{ band: 1, gain: args[2] },
					{ band: 2, gain: args[3] },
					{ band: 3, gain: args[4] },
					{ band: 4, gain: args[5] },
					{ band: 5, gain: args[6] },
					{ band: 6, gain: args[7] },
					{ band: 7, gain: args[8] },
					{ band: 8, gain: args[9] },
					{ band: 9, gain: args[10] },
					{ band: 10, gain: args[11] },
					{ band: 11, gain: args[12] },
					{ band: 12, gain: args[13] },
					{ band: 13, gain: args[14] },
					{ band: 14, gain: args[15] }
				];
				thing
					.setDescription("**The filter is now set to `custom`**")
					.setColor(process.env.SIGHEX);
				player.setEQ(...bands);
				player.filter = "custom";
			} else {
				thing
					.setDescription("**Unknown Filter**")
					.setColor(process.env.REDHEX);
			}
			return message.channel.send({ embeds: [thing] });
		}
	}
};
