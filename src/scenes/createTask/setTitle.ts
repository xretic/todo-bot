import { Scenes } from "telegraf";
import { CustomContext } from "../../types/context";

export const setTitle = new Scenes.BaseScene<CustomContext>("setTitle").on(
	"text",
	async (ctx) => {
		ctx.scene.enter("setDescription", {
			title: ctx.message.text,
			...ctx.scene.session.state,
		});
	}
);
