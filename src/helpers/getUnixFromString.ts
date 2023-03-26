import moment from "moment";

export default (date: string): number => {
	const splitedDate = date.split("/");

	const checker = new Date();

	const year = checker.getUTCFullYear();
	const mouth = splitedDate[0];
	const day = splitedDate[1];

	const parseDate = new Date(`${year}-${mouth}-${day}$00:00:00`);
	const setedDate = moment(parseDate);

	if (setedDate.isValid()) {
		if (setedDate.unix() < moment().unix()) {
			return 405;
		}

		return setedDate.unix();
	} else {
		return 405;
	}
};
