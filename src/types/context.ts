import { Context, Scenes } from "telegraf";

export interface CustomSession extends Scenes.SceneSessionData {
	state?: {
		title: string;
		startDate: number;
		endDate: number;
		token: string;
	};
}

export interface CustomContext extends Context {
	scene: Scenes.SceneContextScene<CustomContext, CustomSession>;
}
