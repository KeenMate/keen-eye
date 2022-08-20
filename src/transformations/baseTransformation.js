import {matchWithStairs} from "@/helpers/stringHelpers"
import {TransformationTypes} from "@/constants/transformation"

/**
 * @property transformationId {symbol}
 * @property type {TransformationTypes}
 * @property headerRule {string}
 */
export class BaseTransformation {
	constructor(headerRule) {
		this.transformationId = Symbol()
		this.type = TransformationTypes.base
		this.headerRule = headerRule
	}

	match(headerName) {
		return matchWithStairs(headerName, this.headerRule)
	}
}
