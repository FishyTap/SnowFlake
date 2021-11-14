const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const moment = require("moment");
const { Pagination } = require("../../../utils/Pagination");

module.exports = {
	name: "server",
	description: "Shows the infoirmation of the server",
	type: "CHAT_INPUT",
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	callbacks: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: false
		});

		const verificationLevels = {
			NONE: "None",
			LOW: "Low",
			MEDIUM: "Medium",
			HIGH: "High",
			HIGHEST: "Highest"
		};

		// const regions = {
		// 	brazil: "Brazil",
		// 	europe: "Europe",
		// 	hongkong: "Hong Kong",
		// 	india: "India",
		// 	japan: "Japan",
		// 	russia: "Russia",
		// 	singapore: "Singapore",
		// 	southafrica: "South Africa",
		// 	sydeny: "Sydeny",
		// 	"us-central": "US Central",
		// 	"us-east": "US East",
		// 	"us-west": "US Westside",
		// 	"us-south": "US Southside"
		// };

		const roles = interaction.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);

		const members = interaction.guild.members.cache;

		const channels = interaction.guild.channels.cache;

		const emojis = interaction.guild.emojis.cache;

		let rolesdisplay;

		if (roles.length < 20) {
			rolesdisplay = roles.join(" ");
		} else {
			rolesdisplay = roles.slice(20).join(" ");
		}

		const { guild } = interaction;
		const {
			name,
			id,
			createdTimestamp,
			memberCount,
			verificationLevel,
			premiumSubscriptionCount,
			ownerId,
			premiumTier,
			nsfwLevel
		} = guild;

		const embed1 = new MessageEmbed()
			.setColor(process.env.SIGHEX)
			.setTitle(`**Information of**  ***${name}***`)
			.setThumbnail(guild.iconURL())
			.addField(
				`**General**`,
				`
				**Name:** \`${name}\`
				**ID:** **\`${id}\`**
				**Owner:** ${guild.members.cache.get(ownerId)}
				**Boost Tier:** \`${premiumTier}\`
				**Verification Level:** \`${verificationLevels[verificationLevel]}\`
				**Boost Level:** \`${premiumSubscriptionCount || "0"}\`
				**NSFW Level:** \`${nsfwLevel}\`
				**Created At:** \`${moment(createdTimestamp).format("LT")} ${moment(
					createdTimestamp
				).format("LL")} ${moment(createdTimestamp).fromNow()}\`
			`
			);

		const embed2 = new MessageEmbed()
			.setColor(process.env.SIGHEX)
			.setTitle(`**Information of**  ***${name}***`)
			.setTitle(`**Information of**  ***${name}***`)
			.setThumbnail(guild.iconURL())
			.addField(
				"**Stats**",
				`
				**Role Count:** \`${roles.length}\`
				**Emoji Count:** \`${emojis.size}\`
				**Ordinary Emoji Count:** \`${emojis.filter((emoji) => !emoji.animated).size}\`
				**Animated Emoji Count:** \`${emojis.filter((emoji) => emoji.animated).size}\`
				**Member Count:** \`${memberCount}\`
				**Users:** \`${members.filter((member) => !member.user.bot).size}\`
				**Bots:** \`${members.filter((member) => member.user.bot).size}\`
			`
			)
			.addField(`**Roles [${roles.length - 1}]**`, `${rolesdisplay}`);

		const embed3 = new MessageEmbed()
			.setColor(process.env.SIGHEX)
			.setTitle(`**Information of**  ***${name}***`)
			.setThumbnail(guild.iconURL())
			.addField(
				"**Presence**",
				`
				**Online:** \`${
					members.filter(
						(member) => member.presence?.status === "online"
					).size
				}\`
				**Offline:** \`${
					members.filter(
						(member) => member.presence?.status === "offline"
					).size
				}\`
				**Do Not Disturb:** \`${
					members.filter(
						(member) => member.presence?.status === "dnd"
					).size
				}\`
				**Idle:** \`${
					members.filter(
						(member) => member.presence?.status === "idle"
					).size
				}\`
			`
			);

		const embed4 = new MessageEmbed()
			.setColor(process.env.SIGHEX)
			.setTitle(`**Information of**  ***${name}***`)
			.setThumbnail(guild.iconURL())
			.addField(
				"**Channels**",
				`
				**Categories:** \`${
					channels.filter(
						(channel) => channel.type === "GUILD_CATEGORY"
					).size
				}\`
				**Text Channels:** \`${
					channels.filter((channel) => channel.type === "GUILD_TEXT")
						.size
				}\`
				**Voice Channels:** \`${
					channels.filter((channel) => channel.type === "GUILD_VOICE")
						.size
				}\`
				**Stage Channels:** \`${
					channels.filter(
						(channel) => channel.type === "GUILD_STAGE_VOICE"
					).size
				}\`
			`
			);

		Pagination(
			interaction,
			[embed1, embed2, embed3, embed4],
			null,
			300000,
			[true, true],
			true
		);
	}
};
