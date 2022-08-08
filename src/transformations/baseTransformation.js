import {matchWithStairs} from "@/helpers/stringHelpers"

export class BaseTransformation {

	constructor(headerRule) {
		this.type = "base"
		this.headerRule = headerRule
	}

	match(headerName) {
		return matchWithStairs(headerName, this.headerRule)
	}
}
