console.clear();

const Discord = require("discord.js");
const path = require("path");
const chalk = require("chalk");
const { Manager } = require("erela.js");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");
const Spotify = require("erela.js-spotify");
const fs = require("fs");
require("dotenv").config();
require("./mongo")();

console.log(chalk.bold.white("[==========Building Project==========]"));

const client = new Discord.Client({
	intents: new Discord.Intents(32767),
	partials: ["CHANNEL", "MESSAGE", "REACTION"],
	shards: "auto",
	restTimeOffset: 0
});

client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();

require(path.join(__dirname, "./loaders/loader"))(client);

client.login(process.env.TOKEN);

// Lavalink
client.manager = new Manager({
	nodes: [
		{
			host: "disbotlistlavalink.ml",
			password: "LAVA",
			port: 443,
			retryDelay: 3000,
			secure: true
		}
	],
	plugins: [
		new Deezer(),
		new Facebook(),
		new Spotify({
			clientID: process.env.SPOTIFY_ID,
			clientSecret: process.env.SPOTIFY_SECRET
		})
	],
	send: (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	}
});

fs.readdirSync(path.join(__dirname, "lavalink")).forEach((folder) => {
	if (folder == "Lavalink.jar") return;
	fs.readdirSync(path.join(__dirname, "lavalink", folder))
		.filter((files) => files.endsWith(".js"))
		.forEach((file) => {
			try {
				let events = require(path.join(
					__dirname,
					"lavalink",
					folder,
					file
				));
				let name = file.split(".")[0];

				client.manager.on(name, events.bind(null, client));
				console.log(
					chalk.bold.hex("#FF5555")("|") +
						" " +
						chalk.bold.white("[Lavalink]") +
						" " +
						chalk.bold.hex("#FF392E")(`"${file}"`)
				);
			} catch (err) {
				console.log(err);
				console.log(
					chalk.bold.hex("#FF5555")("|") +
						" " +
						chalk.bold.hex("#FF0000")("[Lavalink]") +
						" " +
						chalk.bold.hex("#FF0000")(`"${file}"`)
				);
			}
		});
});

client.on("ready", () => {
	client.manager.init(client.user.id);
});

client.on("raw", (i) => {
	client.manager.updateVoiceState(i);
});
