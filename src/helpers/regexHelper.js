export function parseRegex(regexString) {
	const lastIndex = regexString.lastIndexOf("/")

	const flags = regexString.substring(lastIndex + 1, regexString.length)

	const stringPart = regexString.substring(1, lastIndex)

	return new RegExp(stringPart, flags)
}
