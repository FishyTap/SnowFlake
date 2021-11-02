const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const features = "../../features";

module.exports = (client) => {
	try {
		fs.readdirSync(path.join(__dirname, features))
			.filter((files) => files.endsWith(".js"))
			.forEach((file) => {
				require(path.join(__dirname, features, file))(client);
				console.log(
					chalk.bold.hex(process.env.SIDEBARHEX)("|") +
						" " +
						chalk.bold.white("[Features]") +
						" " +
						chalk.bold.hex(process.env.MAGENTAHEX)(`"${file}"`)
				);
			});
	} catch (err) {
		console.log(err);
		console.log(
			chalk.bold.hex(process.env.SIDEBARHEX)("|") +
				" " +
				chalk.bold.hex(process.env.ERRORHEX)("[Features]") +
				" " +
				chalk.bold.hex(process.env.ERRORHEX)(
					`Error: Failed to load "${file}"`
				)
		);
	}
};
