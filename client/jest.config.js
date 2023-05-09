let config = {
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.svelte$': 'svelte-jester'
	},
	moduleFileExtensions: ['js', 'svelte'],
	testPathIgnorePatterns: ['node_modules'],
	bail: false,
	verbose: true,
	testEnvironment: 'jest-environment-jsdom',
	transformIgnorePatterns: ['node_modules'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};

export default config;
