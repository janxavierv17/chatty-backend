import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const uri =
	"mongodb+srv://admin:admin@cluster0.kvpit.mongodb.net/?retryWrites=true&w=majority&appName=chattyApp";
const client = new MongoClient(uri, {
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
