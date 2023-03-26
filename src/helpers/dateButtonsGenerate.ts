import moment from "moment";
import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export default (
	skipDay: boolean = false
): Markup.Markup<InlineKeyboardMarkup> => {
	const dates: number[] = [];
	let additionTime: number = skipDay ? 86400 : 0;

	for (let i: number = 0; i < 7; i++) {
		dates.push(moment().unix() + additionTime);
		additionTime += 86400;
	}

	const buttons = dates.map((x) =>
		Markup.button.callback(moment.unix(x).format("L"), `date:${x}`)
	);

	if (!skipDay) {
		buttons.push(Markup.button.callback("Ввести вручную", `manualInput`));
	}

	return Markup.inlineKeyboard(buttons.map((x) => [x]));
};
