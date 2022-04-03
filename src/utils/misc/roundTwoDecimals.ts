export let roundTwoDecimals = (x: number) =>
	(Math.round((x + Number.EPSILON) * 100) / 100).toFixed(2);
