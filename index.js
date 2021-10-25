console.clear();

const { Client, Collection, Intents } = require("discord.js");
const path = require("path");
const chalk = require("chalk");
require("dotenv").config();
require("./mongo/mongo")();

console.log(chalk.bold.white("[==========Building Project==========]"));

const client = new Client({
	intents: new Intents(32767),
	partials: ["CHANNEL", "MESSAGE", "REACTION"],
	shards: "auto",
	restTimeOffset: 0
});

client.owner = {
	username: "FishyTap Dev™",
	tag: "FishyTap Dev™#8755",
	discriminator: "8755",
	id: "835037519786803251"
};

client.commands = new Collection();
client.interactions = new Collection();
client.afk = new Collection();
client.snipes = new Collection();

require(path.join(__dirname, "./loaders/loader"))(client);

const test = false;

client.login(test == false ? process.env.TOKEN : process.env.TEST);

// Lavalink
(async () => {
	const { Manager } = require("erela.js");
	const Deezer = require("erela.js-deezer");
	const Facebook = require("erela.js-facebook");
	const Spotify = require("erela.js-spotify");
	const fs = require("fs");

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

	fs.readdirSync(path.join(__dirname, "./events/lavalink"))
		.filter((files) => files.endsWith(".js"))
		.forEach((file) => {
			try {
				let events = require(path.join(
					__dirname,
					"./events/lavalink",
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

	client.on("ready", () => {
		client.manager.init(client.user.id);
	});

	client.on("raw", (i) => {
		client.manager.updateVoiceState(i);
	});
})();

module.export = { test };
