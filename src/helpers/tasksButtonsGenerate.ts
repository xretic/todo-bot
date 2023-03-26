import { Task } from "@prisma/client";
import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export default (tasks: Task[]): Markup.Markup<InlineKeyboardMarkup> => {
	const buttons = [];

	for (let i = 0; i < tasks.length; i += 5) {
		buttons.push(
			tasks
				.slice(i, i + 5)
				.map((task, index) =>
					Markup.button.callback(String(index + i + 1), `task:${task.token}`)
				)
		);
	}

	return Markup.inlineKeyboard(buttons);
};
