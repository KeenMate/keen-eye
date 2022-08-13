module.exports = {
	extends: [
		// add more generic rulesets here, such as:
		// 'eslint:recommended',
		"plugin:vue/vue3-recommended"
		// 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
	],
	rules: {
		// override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
		"vue/multi-word-component-names": "off",
		indent: ["error", "tab", { SwitchCase: 1 }],
		"vue/html-indent": ["error", "tab"],
		"vue/html-self-closing": [
			"error",
			{
				html: {
					void: "always",
					normal: "always",
					component: "always"
				}
			}
		]
	}
}
