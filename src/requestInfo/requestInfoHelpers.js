export function sortHeaders(headers) {
	return headers.sort((a, b) =>
		a.name.toLowerCase() > b.name.toLowerCase()
			? 1
			: b.name.toLowerCase() > a.name.toLowerCase()
				? -1
				: 0
	);
}
