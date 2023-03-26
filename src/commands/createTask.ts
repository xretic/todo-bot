import { Command } from "../types/command";
import { CustomContext } from "../types/context";

export const execute: Command = {
	name: "create_task",
	collect: async (ctx: CustomContext): Promise<void> => {
		await ctx.scene.enter("setStartDate");
	},
};
