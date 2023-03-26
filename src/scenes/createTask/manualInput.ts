import { Scenes } from "telegraf";
import getUnixFromString from "../../helpers/getUnixFromString";
import { CustomContext } from "../../types/context";

export const manualInput = new Scenes.BaseScene<CustomContext>(
	"manualInput"
).on("text", async (ctx) => {
	const startUnixTime = getUnixFromString(ctx.message.text.split(" ")[0]);
	const endUnixTime = getUnixFromString(ctx.message.text.split(" ")[1]);

	await ctx.deleteMessage();

	if ([startUnixTime, endUnixTime].some((x) => x === 405)) {
		await ctx.reply("*Ты отправил некорректную дату!*", {
			parse_mode: "Markdown",
		});

		return ctx.scene.leave();
	}

	if (startUnixTime >= endUnixTime) {
		await ctx.reply("*Ошибка! Минимальный интервал между датами - 1 день*", {
			parse_mode: "Markdown",
		});

		return ctx.scene.leave();
	}

	await ctx.reply("*Отправь в чат заголовок задачи*", {
		parse_mode: "Markdown",
	});

	ctx.scene.enter("setTitle", {
		startDate: startUnixTime,
		endDate: endUnixTime,
	});
});
