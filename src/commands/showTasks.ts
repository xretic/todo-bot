import { Command } from "../types/command";
import { CustomContext } from "../types/context";

export const execute: Command = {
	name: "show_tasks",
	collect: async (ctx: CustomContext): Promise<void> => {
		await ctx.scene.enter("showTasks");
	},
};
