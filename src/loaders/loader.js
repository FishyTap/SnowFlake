const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const loader = "../loaders";

module.exports = (client) => {
    fs.readdirSync(path.join(__dirname, loader)).forEach(dir => {
        try {
            if (dir.endsWith(".js")) {
                return;
            } else {
                fs.readdirSync(path.join(__dirname, loader, dir)).filter(files => files.endsWith(".js")).forEach(file => {
                    require(path.join(__dirname, loader, dir, file))(client);
                });
            }
        } catch (err) {
            console.log(err);
            console.log(chalk.bold.hex("#FF5555")("|") + " " + chalk.bold.hex("#FF0000")("[Loader]") + " " + chalk.bold.hex("#FF0000")(`Error: Failed to load "${dir}"`));
        }
    });
}