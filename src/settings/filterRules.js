import {matchWithStairs} from "@/helpers/stringHelpers"

export default class FilterRules {
	constructor(filterRulesArray, saveFunction) {
		this.rules = filterRulesArray ?? []
		this.saveFunc = saveFunction
	}

	save() {
		if (this.saveFunc && typeof this.saveFunc === "function") {
			this.saveFunc(this.rules)
		}
	}

	toggleAll() {
		//"*" is only rule remove it else set it to be only rules
		if (this.includes("*")) {
			this.rules = []
		} else {
			this.rules = ["*"]
		}
		this.save()
	}

	all() {
		return this.includes("*")
	}

	removeWildCard() {
		this.rules = this.rules.filter(
			(rule) => !rule.includes("*") || rule === "*"
		)
		this.save()
	}

	includes(rule) {
		return this.rules.includes(rule)
	}

	//add rule if not already there
	add(rule) {
		//enforce star
		if (this.all()) {
			this.toggleAll()
		}
		if (!this.includes(rule)) {
			this.rules.push(rule)
		}
		this.save()
	}

	remove(rule) {
		this.rules = this.rules.filter((r) => r !== rule)
		this.save()
	}

	toggle(rule) {
		if (this.includes(rule)) {
			this.remove(rule)
		} else {
			this.add(rule)
		}
	}

	filterOne(key) {
		return this.rules.some((allowed) => {
			return matchWithStairs(key, allowed)
		})
	}

	filter(data, propName) {
		if (this.all()) return data
		if (!data) return []

		return data.filter(({[propName]: key}) => {
			return this.filterOne(key)
		})
	}
}
