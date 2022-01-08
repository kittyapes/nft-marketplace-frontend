export default (future_date_milliseconds: number) => {
	// get total seconds between the times
	if (future_date_milliseconds > 0) {
		let delta = Math.abs(future_date_milliseconds - Date.now()) / 1000;

		// calculate (and subtract) whole days
		const days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// calculate (and subtract) whole minutes
		const minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		// what's left is seconds
		const seconds = delta % 60; // in theory the modulus is not required
		return {
			days: days || 0,
			hours: hours || 0,
			minutes: minutes || 0,
			seconds: seconds || 0
		};
	} else {
		return null;
	}
};
