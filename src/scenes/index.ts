import { start } from "./start";
import { setStartDate } from "./createTask/setStartDate";
import { setEndDate } from "./createTask/setEndDate";
import { manualInput } from "./createTask/manualInput";
import { setTitle } from "./createTask/setTitle";
import { setDescription } from "./createTask/setDescription";
import { showTasks } from "./showTasks";
import { selectEditType } from "./editTask/selectEditType";
import { editTitle } from "./editTask/editTitle";
import { editDescription } from "./editTask/editDescription";

export default [
	start,
	setStartDate,
	setEndDate,
	manualInput,
	setTitle,
	setDescription,
	showTasks,
	selectEditType,
	editTitle,
	editDescription,
];
