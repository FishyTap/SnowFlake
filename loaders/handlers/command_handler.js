const {
    Client
} = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const dir = "../../commands";

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {
    fs.readdirSync(path.join(__dirname, dir)).forEach(folders => {
        fs.readdirSync(path.join(__dirname, dir, folders)).filter(files => files.endsWith(".js")).forEach(file => {
            try {
                const command = require(path.join(__dirname, dir, folders, file));
                client.commands.set(command.name, command);

                console.log(chalk.bold.hex("#FF5555")("|") + " " + chalk.bold.white("[Commands]") + " " + chalk.bold.hex(process.env.LIMEHEX)(`"${file}"`));
            } catch (err) {
                console.log(err);
                console.log(chalk.bold.hex("#FF5555")("|") + " " + chalk.bold.hex("#FF0000")("[Commands]") + " " + chalk.bold.hex("#FF0000")(`Error: Failed to load "${file}"`));
            }
        });
    });
}