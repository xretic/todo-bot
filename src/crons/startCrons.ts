import notificationUsers from "./tasks/notificationUsers";

export default async function (): Promise<void> {
	await notificationUsers();
}
