import { Scenes } from "telegraf";
import dateButtonsGenerate from "../../helpers/dateButtonsGenerate";
import { CustomContext } from "../../types/context";

export const setStartDate = new Scenes.BaseScene<CustomContext>("setStartDate")
	.enter(async (ctx) => {
		await ctx.reply("*Выбери дату начала задачи*", {
			parse_mode: "Markdown",
			...dateButtonsGenerate(),
		});
	})

	.action("manualInput", async (ctx) => {
		await ctx.editMessageText(
			"*Через пробел, в формате Месяц/День отправь в чат дату начала и окончание задачи*",
			{
				parse_mode: "Markdown",
			}
		);

		ctx.scene.enter("manualInput");
	})

	.action(new RegExp(/date:(.+)/i), async (ctx) => {
		const [, startDate] = ctx.match;

		await ctx.deleteMessage();

		ctx.scene.enter("setEndDate", {
			startDate,
		});
	});
