/* eslint-disable no-undef */
module.exports = {
	env: {
		node: true,
	},
	extends: [
		// add more generic rulesets here, such as:
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		// 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
	],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		quotes: ["warn", "double"],
		indent: [
			"warn",
			"tab",
			{
				SwitchCase: 1,
			},
		],
		"no-tabs": "off",
		"space-before-function-paren": "off",
		"object-curly-spacing": ["error", "never"],
		curly: "off",
		"prefer-const": "warn",
		"no-mixed-operators": "off",
		"no-unused-vars": "warn",
		"no-eval": "off",
		eqeqeq: "off",
		"operator-linebreak": "off",
		"vue/no-unused-components": "warn",
	},
}
