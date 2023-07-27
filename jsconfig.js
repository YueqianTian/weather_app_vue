import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			external: [/^node:.*/],
		},
	},
	compilerOptions: {
		allowJs: true,
	},
});
