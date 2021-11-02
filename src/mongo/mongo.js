const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoPath = process.env.MONGOPATH;

module.exports = async () => {
	await mongoose.connect(mongoPath, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true
	});

	return mongoose;
};

mongoose.connection.on("connected", () => {
	try {
		console.log(
			chalk.bold.hex(process.env.SIDEBARHEX)("|") +
				" " +
				chalk.bold.white("[Mongoose]") +
				" " +
				chalk.bold.hex(process.env.YELLOWHEX)("Connected to Database!")
		);
	} catch (err) {
		console.log(
			chalk.bold.hex(process.env.SIDEBARHEX)("|") +
				" " +
				chalk.bold.white("[Mongoose]") +
				" " +
				chalk.bold.hex(process.env.ERRORHEX)(
					"Error: Failed to Connect to the Database"
				)
		);
	}
});
