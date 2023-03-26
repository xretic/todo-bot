import { Scenes } from "telegraf";
import { CustomContext } from "../../types/context";
import { prisma } from "../../common/prisma";
import forceSetSession from "../../utils/forceSetSession";
import generateToken from "../../helpers/generateToken";

export const setDescription = new Scenes.BaseScene<CustomContext>(
	"setDescription"
)
	.enter(async (ctx) => {
		await ctx.reply("*Отправь в чат описание задачи*", {
			parse_mode: "Markdown",
		});
	})

	.on("text", async (ctx) => {
		await forceSetSession(ctx);

		const { title, startDate, endDate } = ctx.scene.session.state;

		await prisma.user.update({
			where: {
				userId: ctx.from.id,
			},

			data: {
				tasks: {
					push: {
						token: await generateToken(ctx.from.id),
						title: title,
						description: ctx.message.text,
						startDate: startDate,
						endDate: endDate,
					},
				},
			},
		});

		await ctx.reply("*Задача успешно создана!*", {
			parse_mode: "Markdown",
		});

		ctx.scene.leave();
	});
