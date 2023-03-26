import { Scenes } from "telegraf";
import dateButtonsGenerate from "../../helpers/dateButtonsGenerate";
import { CustomContext } from "../../types/context";
import moment from "moment";

export const setEndDate = new Scenes.BaseScene<CustomContext>("setEndDate")
	.enter(async (ctx) => {
		await ctx.reply("*Выбери дату удаление задачи*", {
			parse_mode: "Markdown",
			...dateButtonsGenerate(true),
		});
	})

	.action(new RegExp(/date:(.+)/i), async (ctx) => {
		const [, endDate] = ctx.match;
		const startDate = ctx.scene.session.state.startDate;

		const [startDay, endDay] = [startDate, Number(endDate)].map(
			(x) => moment.unix(x).format("l").split("/")[1]
		);

		if (startDate > Number(endDate) || startDay === endDay) {
			await ctx.editMessageText(
				"*Ошибка! Минимальный интервал между датами - 1 день*",
				{
					parse_mode: "Markdown",
				}
			);

			await ctx.answerCbQuery(
				"Ошибка! Минимальный интервал между датами - 1 день"
			);

			return ctx.scene.leave();
		}

		await ctx.editMessageText("*Отправьте в чат заголовок задачи*", {
			parse_mode: "Markdown",
		});

		ctx.scene.enter("setTitle", {
			startDate: Number(startDate),
			endDate: Number(endDate),
		});
	});
