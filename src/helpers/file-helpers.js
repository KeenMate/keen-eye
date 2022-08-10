/**
 * @param file {File}
 * @returns {Promise<string>}
 */
export function readTextFile(file) {
	if (!isTextFile(file))
		return Promise.reject(new Error("Cannot read given file because it is not in text format"))

	return new Promise(resolve => {
		const reader = new FileReader()

		reader.onload = e => {
			resolve(e.target.result)
		}

		reader.readAsText(file)
	})
}

function isTextFile(file) {
	return file.type.startsWith("text/")
		|| ["application/json"].find(x => x === file.type)
}
