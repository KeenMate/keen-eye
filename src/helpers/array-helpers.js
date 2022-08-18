import {orderBy} from "lodash"

export function distinctAndSortArray(array, sortByKeys = null, orders = null) {
	return orderBy(Array.from(new Set(array)), sortByKeys, orders)
}
