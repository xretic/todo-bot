import { CronJob } from "cron";
import { prisma } from "../../common/prisma";
import moment from "moment";
import { telegramClient } from "../../common/telegram";

const cron = async (): Promise<void> => {
	const users = await prisma.user.findMany({});

	for (const user of users) {
		const tasks = user.tasks.filter(
			(x) => moment().unix() > Number(x.startDate) && !x.notified
		);

		if (tasks.length === 0) {
			continue;
		}

		for (const task of tasks) {
			await telegramClient.telegram
				.sendMessage(
					Number(user.userId),
					`*Пришло время выполнение задачи ${task.title}!*`,
					{
						parse_mode: "Markdown",
					}
				)
				.catch(() => {});

			const { token, title, description, startDate, endDate } = task;

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

			await prisma.user.update({
				where: {
					userId: user.userId,
				},

				data: {
					tasks: {
						push: {
							token,
							title,
							description,
							startDate,
							endDate,
							notified: true,
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
