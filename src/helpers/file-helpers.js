/**
 * @param file {File}
 * @returns {Promise<string>}
 */
export function readTextFile(file) {
	console.log(file)

	if (!isTextFile(file))
		return Promise.reject(
			new Error("Cannot read given file because it is not in text format")
		)

	return new Promise((resolve) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			resolve(e.target.result)
		}

		reader.readAsText(file)
	})
}

function isTextFile(file) {
	console.log(file.type)

	return (
		file.type.startsWith("text/") ||
		["application/json"].find((x) => x === file.type)
	)
}

//https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
export function downloadJSON(exportObj, exportName) {
	const dataStr =
		"data:text/json;charset=utf-8," +
		encodeURIComponent(JSON.stringify(exportObj))
	const downloadAnchorNode = document.createElement("a")
	downloadAnchorNode.setAttribute("href", dataStr)
	downloadAnchorNode.setAttribute("download", exportName + ".json")
	document.body.appendChild(downloadAnchorNode) // required for firefox
	downloadAnchorNode.click()
	downloadAnchorNode.remove()
}
