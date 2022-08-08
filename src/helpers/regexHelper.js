export function parseRegex(regexString) {
	let lastIndex = regexString.lastIndexOf("/");

	let flags = regexString.substring(lastIndex + 1, regexString.length);

	let stringPart = regexString.substring(1, lastIndex);

	let regex = new RegExp(stringPart, flags);
	console.log(regex);
	return regex;
}
