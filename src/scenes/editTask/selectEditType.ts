import { CustomContext } from "../../types/context";
import { Scenes, Markup } from "telegraf";
import { prisma } from "../../common/prisma";

export const selectEditType = new Scenes.BaseScene<CustomContext>(
	"selectEditType"
)
	.action("title", async (ctx) => {
		const { token } = ctx.scene.session.state;

		await ctx.editMessageText("*Отправьте в чат новый заголовок задачи*", {
			parse_mode: "Markdown",
		});

		ctx.scene.enter("editTitle", {
			token,
		});
	})

	.action("description", async (ctx) => {
		const { token } = ctx.scene.session.state;

		await ctx.editMessageText("*Отправьте в чат новое описание задачи*", {
			parse_mode: "Markdown",
		});

		ctx.scene.enter("editDescription", {
			token,
		});
	})

	.action("back", async (ctx) => {
		await ctx.deleteMessage();

		ctx.scene.enter("showTasks");
	});
