import { CustomContext } from "../../types/context";
import { Scenes, Markup } from "telegraf";
import { prisma } from "../../common/prisma";

export const editDescription = new Scenes.BaseScene<CustomContext>(
	"editDescription"
).on("text", async (ctx) => {
	const { token } = ctx.scene.session.state;

	const user = await prisma.user.findFirst({
		where: {
			userId: ctx.from.id,
		},
	});

	const task = user.tasks.filter((x) => x.token === token)[0];

	if (!task) {
		await ctx.reply("*Не удалось получить доступ к задаче*", {
			parse_mode: "Markdown",
		});

		return ctx.scene.leave();
	}

	const { title, startDate, endDate } = task;

	await prisma.user.update({
		where: {
			userId: ctx.from.id,
		},

		data: {
			tasks: {
				deleteMany: {
					where: {
						token,
					},
				},
			},
		},
	});

	await prisma.user.update({
		where: {
			userId: ctx.from.id,
		},

		data: {
			tasks: {
				push: {
					token,
					title,
					description: ctx.message.text,
					startDate,
					endDate,
				},
			},
		},
	});

	await ctx.reply("*Описание задачи успешно обновлёно*", {
		parse_mode: "Markdown",
	});

	ctx.scene.enter("showTasks");
});
