import { prisma } from "../common/prisma";

export default async function generateToken(userId: number): Promise<string> {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	let token: string = "";

	for (let i = 0; i < 16; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	const user = await prisma.user.findFirst({
		where: {
			userId,
		},
	});

	if (user.tasks.filter((x) => x.token === token)[0]) {
		return generateToken(userId);
	}

	return token;
}
