import { connectDatabase } from "./prisma";
import { startBot } from "./telegram";
import { config } from "dotenv";
import path from "path";
import startCrons from "../crons/startCrons";

export default async (): Promise<void> => {
	config({
		path: path.resolve(__dirname, "../../.env"),
	});

	await connectDatabase();
	await startBot();
	await startCrons();

	console.log("App started!");
};
