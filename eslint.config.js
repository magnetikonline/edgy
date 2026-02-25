const { defineConfig } = require('eslint/config'),
	globals = require('globals'),
	js = require('@eslint/js');


module.exports = defineConfig([{
	languageOptions: {
		ecmaVersion: 2020, // es2020
		globals: { ...globals.node },
		sourceType: 'commonjs',
	},
	extends: [js.configs.recommended],
	files: ['**/*.js'],
	plugins: { js },
	rules: {
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				imports: 'always-multiline',
				objects: 'always-multiline',
			},
		],
		eqeqeq: 'error',
		'no-prototype-builtins': 'off',
		'no-unused-vars': [
			'error',
			{
				args: 'none',
			},
		],
		quotes: ['error','single'],
		semi: ['error','always'],
		'semi-spacing': 'error',
		'spaced-comment': 'error',
	},
}]);
