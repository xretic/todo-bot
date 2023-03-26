import { CustomContext } from "../types/context";
import { store } from "../classes/SessionStore";

export default async function (ctx: CustomContext): Promise<void> {
	const key = getSessionKey(ctx);

	if (key) {
		store.set(key, ctx.scene.session);
	}
}

function getSessionKey(ctx: CustomContext): string | undefined {
	const fromId = ctx.from?.id;
	const chatId = ctx.chat?.id;

	if ([fromId, chatId].some((x) => x === null)) {
		return undefined;
	}

	return `${fromId}:${chatId}`;
}
