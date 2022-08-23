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
		"object-curly-spacing": ["error", "never"],
		"array-bracket-spacing": ["error", "never"],
		"computed-property-spacing": ["error", "never"],
		"vue/multi-word-component-names": "off",
		indent: ["error", "tab", {SwitchCase: 1}],
		"vue/html-indent": "off",
		"vue/mustache-interpolation-spacing": ["error", "never"],
		"vue/require-default-prop": "off",
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
