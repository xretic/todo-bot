import { Markup, Scenes } from "telegraf";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";
import moment from "moment";
import tasksButtonsGenerate from "../helpers/tasksButtonsGenerate";
import getTasks from "../helpers/getTasks";

export const showTasks = new Scenes.BaseScene<CustomContext>("showTasks")
	.enter(async (ctx) => {
		const tasks = await getTasks(ctx);

		if (tasks.length === 0) {
			await ctx.reply("*На данный момент у тебя нет активных задач*", {
				parse_mode: "Markdown",
			});

			return ctx.scene.leave();
		}

		await ctx.reply(
			"*Твои задачи*\n\n" +
				tasks.map((x, i) => `*${i + 1}.* \`${x.title}\``).join("\n"),
			{
				parse_mode: "Markdown",
				...tasksButtonsGenerate(tasks),
			}
		);
	})
	.action(new RegExp(/task:(.+)/i), async (ctx) => {
		const user = await prisma.user.findFirst({
			where: {
				userId: ctx.from.id,
			},
		});

		const [, token] = ctx.match;

		const task = user.tasks.filter((x) => x.token === token)[0];

		if (!task) {
			await ctx.editMessageText("*Доступ к задаче утерян!*", {
				parse_mode: "Markdown",
			});

			return await ctx.answerCbQuery("Доступ к задаче утерян!");
		}

		await ctx.editMessageText(
			"*Просмотр задачи*\n\n" +
				`*Заголовок* - \`${task.title}\`\n` +
				`*Описание* - \`${task.description}\`\n` +
				`*Дата начала* - \`${moment
					.unix(Number(task.startDate))
					.format("L")}\`\n` +
				`*Дата конца* - \`${moment.unix(Number(task.endDate)).format("L")}\``,
			{
				parse_mode: "Markdown",
				...Markup.inlineKeyboard([
					[
						Markup.button.callback(
							"✅ Объявить выполненым",
							`complete:${task.token}`
						),
					],
					[
						Markup.button.callback("📝 Редактировать", `edit:${task.token}`),
						Markup.button.callback("📇 Удалить", `delete:${task.token}`),
					],
					[Markup.button.callback("⬅️ Назад", "back")],
				]),
			}
		);
	})

	.action(new RegExp(/complete:(.+)/i), async (ctx) => {
		const [, token] = ctx.match;

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

		const tasks = await getTasks(ctx);

		if (tasks.length === 0) {
			await ctx.editMessageText(
				"*На данный момент у тебя нет активных задач*",
				{
					parse_mode: "Markdown",
				}
			);

			return ctx.scene.leave();
		}

		await ctx.editMessageText(
			"*Ваши задачи*\n\n" +
				tasks.map((x, i) => `*${i + 1}.* \`${x.title}\``).join("\n"),
			{
				parse_mode: "Markdown",
				...tasksButtonsGenerate(tasks),
			}
		);
	})

	.action(new RegExp(/edit:(.+)/i), async (ctx) => {
		const [, token] = ctx.match;

		await ctx.editMessageText("*Выбери что ты хочешь редактировать*", {
			parse_mode: "Markdown",
			...Markup.inlineKeyboard([
				[
					Markup.button.callback("📑 Заголовок", "title"),
					Markup.button.callback("📖 Описание", "description"),
				],
				[Markup.button.callback("⬅️ Назад", "back")],
			]),
		});

		ctx.scene.enter("selectEditType", {
			token,
		});
	})

	.action(new RegExp(/delete:(.+)/i), async (ctx) => {
		const [, token] = ctx.match;

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

		const tasks = await getTasks(ctx);

		if (tasks.length === 0) {
			await ctx.editMessageText(
				"*На данный момент у тебя нет активных задач*",
				{
					parse_mode: "Markdown",
				}
			);

			return ctx.scene.leave();
		}

		await ctx.editMessageText(
			"*Ваши задачи*\n\n" +
				tasks.map((x, i) => `*${i + 1}.* \`${x.title}\``).join("\n"),
			{
				parse_mode: "Markdown",
				...tasksButtonsGenerate(tasks),
			}
		);
	})

	.action("back", async (ctx) => {
		const tasks = await getTasks(ctx);

		await ctx.editMessageText(
			"*Ваши задачи*\n\n" +
				tasks.map((x, i) => `*${i + 1}.* \`${x.title}\``).join("\n"),
			{
				parse_mode: "Markdown",
				...tasksButtonsGenerate(tasks),
			}
		);
	});
