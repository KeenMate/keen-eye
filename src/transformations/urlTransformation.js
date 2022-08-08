import {types} from "@/transformations/transformationConstants"
import {BaseTransformation} from "./baseTransformation"

export class UrlTransformation extends BaseTransformation {

	constructor(headerRule, url) {
		super(headerRule)

		this.url = url
		this.type = types.url
	}

	/**
	 * replaces placeholders in url {} = headerValue {name} = value of header with same name
	 */
	getTransformedUrl(headerValue, headers) {
		let transformedUrl = this.url.replace("{}", headerValue)

		headers.forEach((header) => {
			transformedUrl = transformedUrl.replace(`{${header.name}}`, header.value)
		})

		return transformedUrl
	}
}
