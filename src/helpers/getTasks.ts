import { Task } from "@prisma/client";
import { CustomContext } from "../types/context";
import { prisma } from "../common/prisma";
import moment from "moment";

export default async function (ctx: CustomContext): Promise<Task[]> {
	const user = await prisma.user.findFirst({
		where: {
			userId: ctx.from.id,
		},
	});

	const tasks = user.tasks.filter((x) => moment().unix() > Number(x.startDate));

	return tasks;
}
