import { CustomContext } from "./context";

export type Command = {
	name: string;
	collect: (ctx: CustomContext) => Promise<void>;
};
