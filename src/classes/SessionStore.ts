import { prisma } from "../common/prisma";

export class SessionStore<T extends object> {
	constructor() {}

	async get(key: string): Promise<any> {
		const session = await prisma.session.findUnique({ where: { key } });

		if (session) {
			return session.data;
		}

		return undefined;
	}

	async set(key: string, data: any): Promise<void> {
		await prisma.session.upsert({
			create: {
				key,
				data,
			},

			update: {
				data,
			},

			where: {
				key,
			},
		});
	}

	async delete(key: string): Promise<void> {
		await prisma.session.delete({
			where: {
				key,
			},
		});
	}
}

export const store = new SessionStore();
