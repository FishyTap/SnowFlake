const chalk = require("chalk");
const Rpc = require("discord-rpc");
const rpc = new Rpc.Client({
	transport: "ipc"
});

module.exports = () => {
	rpc.on("ready", async () => {
		await rpc.setActivity({
			buttons: [
				{
					label: "Youtube",
					url: "https://www.youtube.com/channel/UCPMMaUH5nUNaCQ91nXYHFRQ"
				},
				{
					label: "SnowFlake",
					url: "http://is.gd/SnowFlake"
				}
			],
			details: "Stay Cool!",
			state: "Chilling...",
			startTimestamp: new Date(),
			largeImageKey: "large_rpc_icon",
			largeImageText: "SnowFlake",
			smallImageKey: "small_rpc_icon",
			smallImageText: "Youtube"
		});
		console.log(
			chalk.bold.hex("#FF5555")("|") +
				" " +
				chalk.bold.white("[Client]") +
				" " +
				chalk.bold.hex("#00FFFF")(`RichPresence is now Running!`)
		);
	});

	rpc.login({
		clientId: process.env.ID,
		clientSecret: process.env.SECRET
	});
};
