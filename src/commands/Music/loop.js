const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
	name: "loop",
	aliases: [],
	cooldown: 0,
	permissions: [],
	usage: "<state>",
	description: "Loops the track or queue",
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
		} else if (!args.length) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**You must state a loop state**")
				]
			});
		} else if (!isNaN(args[0])) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(process.env.REDHEX)
						.setDescription("**Invalid Loopstate**")
				]
			});
		} else if (isNaN(args[0])) {
			let statements = [
				"off",
				"disable",
				"track",
				"song",
				"queue",
				"list"
			];

			if (!statements.includes(args[0])) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(process.env.REDHEX)
							.setDescription("**Invalid Loop Statement**")
					]
				});
			} else {
				let loopState = args[0].toString();

				if (loopState.toLowerCase() === "off") loopState = "0";
				if (loopState.toLowerCase() === "disable") loopState = "0";
				if (loopState.toLowerCase() === "track") loopState = "1";
				if (loopState.toLowerCase() === "song") loopState = "1";
				if (loopState.toLowerCase() === "queue") loopState = "2";
				if (loopState.toLowerCase() === "list") loopState = "2";

				loopState = Number(loopState);

				loopOptions = {
					0: args[0],
					1: args[0],
					2: args[0]
				};

				if (loopState === 0) {
					if (player.queueRepeat) {
						player.setQueueRepeat(false);
					} else if (player.trackRepeat) {
						player.setTrackRepeat(false);
					}
					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`🔁 **Loop is now set to  \`${loopOptions[loopState]}\`**`
								)
						]
					});
				} else if (loopState === 1) {
					if (player.trackRepeat) {
						return message.channel.send({
							embeds: [
								new MessageEmbed()
									.setColor(process.env.REDHEX)
									.setDescription(
										`**Track is already looping on ${loopOptions[loopState]}**`
									)
							]
						});
					}

					player.setTrackRepeat(true);
					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`🔁 **Loop is now set to  \`${loopOptions[loopState]}\`**`
								)
						]
					});
				} else if (loopState === 2) {
					if (player.queueRepeat) {
						return message.channel.send({
							embeds: [
								new MessageEmbed()
									.setColor(process.env.REDHEX)
									.setDescription(
										`**Queue is already looping on ${loopOptions[loopState]}**`
									)
							]
						});
					}

					player.setQueueRepeat(true);
					message.channel.send({
						embeds: [
							new MessageEmbed()
								.setColor(process.env.SIGHEX)
								.setDescription(
									`🔁 **Loop is now set to  \`${loopOptions[loopState]}\`**`
								)
						]
					});
				}
			}
		}
	}
};
