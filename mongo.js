const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoPath = process.env.MONGOPATH;

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return mongoose;
}

mongoose.connection.on("connected", () => {
    console.log(chalk.bold.hex("#FF5555")("|") + " " + chalk.bold.white("[Mongoose]") + " " + chalk.bold.hex("#00FFFF")("Connected to Database!"));
});