const schema = require("../../schemas/users");

module.exports = {
	wallet: async (client, id, amount) => {
		let data = await schema.findOne({ userId: id }).catch(() => {});

		data.economy.wallet += amount;

		if (data.economy.wallet < 0) data.economy.wallet = 0;

		await data.save();
	},
	bank: async (client, id, amount) => {
		let data = await schema.findOne({ userId: id }).catch(() => {});

		data.economy.bank += amount;

		if (data.economy.bank < 0) data.economy.bank = 0;

		await data.save();
	}
};
