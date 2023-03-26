import { readdirSync } from "fs";
import path from "path";
import { telegramClient } from "../common/telegram";

export default async (): Promise<void> => {
	const files = readdirSync(path.resolve(__dirname, `../commands/`));

	for (const file of files) {
		const imported = await import(
			path.resolve(__dirname, `../commands/${file}`)
		);

		telegramClient.command(imported.execute.name, imported.execute.collect);
	}
};
