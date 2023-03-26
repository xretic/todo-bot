import { Scenes, Markup } from "telegraf";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";

export const start = new Scenes.BaseScene<CustomContext>("start").enter(
	async (ctx) => {
		await prisma.user.upsert({
			where: {
				userId: ctx.from.id,
			},

			update: {},

			create: {
				userId: ctx.from.id,
			},
		});

		await ctx.reply(
			"*Привет! Я - бот для трекинга задач. Выбери нужное тебе действие*",
			{
				parse_mode: "Markdown",
			}
		);
	}
);
