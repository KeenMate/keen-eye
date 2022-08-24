import {isProxy, toRaw} from "vue"

export function cleanseObjectOfProxies(object) {
	return Object.keys(object)
		.reduce((acc, key) => {
			acc[key] = isProxy(object[key]) ? toRaw(object[key]) : object[key]
			return acc
		}, {})
}
