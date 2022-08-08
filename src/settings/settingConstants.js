export function getEmptySettings() {
	return {
		inject: false,
		headerRules: [],
		requestsRules: [],
		locale: null,
		position: {x: 0, y: 0},
		transformations: [],
		localeReplace: {
			cookieKey: null
		}
	}
}

export const PopupScopes = [
	{
		code: "page",
		title: "Page",
		color: "LightYellow"
	},
	{
		code: "origin",
		title: "Origin",
		color: "LightCoral"
	},
	{
		code: "domain",
		title: "Domain",
		color: "LightGreen"
	},
	{
		code: "global",
		title: "Global",
		color: "LightBlue"
	}
]

// export const Levels2 = {
// 	page: "page",
// 	origin: "origin",
// 	domain: "domain",
// 	global: "global"
// }
//
// export const colors = {
// 	[Levels.global]: "LightBlue",
// 	[Levels.domain]: "LightGreen",
// 	[Levels.origin]: "LightCoral",
// 	[Levels.page]: "LightYellow"
// }
