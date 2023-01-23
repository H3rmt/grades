import {defineConfig} from 'vitest/config';
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// https://reactjs.org/docs/code-splitting.html

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	// prevent vite from obscuring rust errors
	clearScreen: false,
	// tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						if (id.includes("react")) {
							return "react"
						} else if (id.includes("query")) {
							return "query"
						} else if (id.includes("router")) {
							return "router"
						} else if (id.includes("mui")) {
							return "mui"
						}
						return "vendor"
					}
				},
			}
		}
	},
	test: {
		environment: 'jsdom',
		globals: true,
		mockReset: true,
		setupFiles: 'src/setupTests.ts',
	},
});
