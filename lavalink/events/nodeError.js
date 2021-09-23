const {
    Client
} = require("discord.js");
const {
    Node
} = require("erela.js");
const chalk = require("chalk");

/**
 * 
 * @param {Client} client 
 * @param {Node} node 
 * @param {Error} error 
 */

module.exports = (client, node, error) => {
    console.log(chalk.bold.hex("#FF5555")("|") + " " + chalk.bold.hex("#FF0000")("[Lavalink]") + " " + chalk.bold.hex("#FF392E")(`Error: Node "${node.options.identifier}", ==> ${error.message}`));
}