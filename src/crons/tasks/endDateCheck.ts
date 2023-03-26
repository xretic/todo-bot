import { CronJob } from "cron";
import { prisma } from "../../common/prisma";
import moment from "moment";
import { telegramClient } from "../../common/telegram";

const cron = async (): Promise<void> => {
	const users = await prisma.user.findMany({});

	for (const user of users) {
		const tasks = user.tasks.filter((x) => moment().unix() > Number(x.endDate));

		if (tasks.length === 0) {
			continue;
		}

		for (const task of tasks) {
			await telegramClient.telegram
				.sendMessage(
					Number(user.userId),
					`*Время на выполнение задачи ${task.title} закончилось! Задача удалена*`,
					{
						parse_mode: "Markdown",
					}
				)
				.catch(() => {});

			await prisma.user.update({
				where: {
					userId: user.userId,
				},

				data: {
					tasks: {
						deleteMany: {
							where: {
								token: task.token,
							},
						},
					},
				},
			});
		}
	}
};

export default async (): Promise<void> => {
	new CronJob("* * * * *", cron, null, true, null, null, true);
};
