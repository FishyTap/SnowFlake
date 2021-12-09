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

const test = true;

client.login(test == false ? process.env.TOKEN : process.env.TEST);

process.on("unhandledRejection", err => {
	console.log(err);
});

process.on("uncaughtExceptionMonitor", err => {
	console.log(err);
});

// Lavalink
(async () => {
	const { Manager } = require("erela.js");
	const Apple = require("erela.js-apple");
	const Deezer = require("erela.js-deezer");
	const Facebook = require("erela.js-facebook");
	const Spotify = require("erela.js-spotify");

	client.manager = new Manager({
		nodes: [
			{
				host: "disbotlistlavalink.ml", // lavaweed.herokuapp.com
				password: "LAVA", // lavapass
				port: 443,
				retryDelay: 3000,
				secure: true
			}
		],
		plugins: [
			new Deezer(),
			new Apple(),
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

	// Lavalink_handler
	(async () => {
		const fs = require("fs");
		let dir = "./events/lavalink";
		fs.readdirSync(path.join(__dirname, dir))
			.filter(files => files.endsWith(".js"))
			.forEach(file => {
				try {
					let events = require(path.join(__dirname, dir, file));

					let name = file.split(".")[0];

					client?.manager?.on(name, events.bind(null, client));
					console.log(
						chalk.bold.hex(process.env.SIDEBARHEX)("|") +
							" " +
							chalk.bold.white("[Lavalink]") +
							" " +
							chalk.bold.hex(process.env.REDHEX)(`"${file}"`)
					);
				} catch (err) {
					console.log(err);
					console.log(
						chalk.bold.hex(process.env.SIDEBARHEX)("|") +
							" " +
							chalk.bold.hex(process.env.ERRORHEX)("[Lavalink]") +
							" " +
							chalk.bold.hex(process.env.ERRORHEX)(`"${file}"`)
					);
				}
			});
	})();
})();

module.exports = { test };
