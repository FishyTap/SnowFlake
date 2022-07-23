const chalk = require("chalk");
const Rpc = require("discord-rpc");
const { Client } = require("discord.js");
const rpc = new Rpc.Client({
  transport: "ipc",
});
const { test } = require("../index");

/**
 *
 * @param {Client} client
 * @returns
 */
module.exports = (client) => {
  client.on("ready", async () => {
    try {
      rpc.on("ready", async () => {
        await rpc.setActivity({
          buttons: [
            {
              label: "Youtube",
              url: "https://www.youtube.com/channel/UCPMMaUH5nUNaCQ91nXYHFRQ",
            },
            {
              label: `${client.user.username}`,
              url: `https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`,
            },
          ],
          details: "Stay Cool!",
          state: "~ Just Chilling...",
          startTimestamp: new Date(),
          largeImageKey: "large_rpc_icon",
          largeImageText: `${client.user.username}`,
          smallImageKey: "small_rpc_icon",
          smallImageText: "Youtube",
        });
        console.log(
          chalk.bold.hex(process.env.SIDEBARHEX)("|") +
            " " +
            chalk.bold.white("[RichPresence]") +
            " " +
            chalk.bold.hex(process.env.PINKHEX)(`RichPresence is now Running!`)
        );
      });

      rpc
        .login({
          clientId: test == false ? process.env.CLIENT_ID : process.env.TEST_ID,
          clientSecret:
            test == false ? process.env.CLIENT_SECRET : process.env.TEST_SECRET,
        })
        .catch(() => {});
    } catch {
      console.log(
        chalk.bold.hex(process.env.SIDEBARHEX)("|") +
          " " +
          chalk.bold.hex(process.env.ERRORHEX)("[RichPresence]") +
          " " +
          chalk.bold.hex(process.env.ERRORHEX)(
            `Error: Unable to setup RichPresence`
          )
      );
    }
  });
};
