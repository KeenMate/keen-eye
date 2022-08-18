export function sortLocaleCategories(locales) {
	return locales
		.map(x => {
			return {
				...x,
				locales: Array.from(x.locales).sort((ll, rl) => ll.name < rl.name ? -1 : 1)
			}
		})
}
