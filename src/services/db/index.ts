import { z } from "zod";
import { MongoClient, ServerApiVersion } from "mongodb";

const { DATABASE_URL } = process.env;

const client = new MongoClient(DATABASE_URL, {
	monitorCommands: true,
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export default () => {
	const connect = () => {
		client
			.connect()
			.then(() => console.log(`Successfully connected to our MongoDB.`))
			.catch((err) => {
				console.error(`Something went wrong ${err}`);
				client.close();
				return process.exit(1);
			});

		client
			.db("admin")
			.command({ ping: 1 })
			.then((payload) =>
				console.log(`Successfully pinged our db.`, payload)
			)
			.catch((err) =>
				console.error(`Pinged db but an error occured ${err}`)
			);
	};
	connect();
};
