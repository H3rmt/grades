import {defineConfig} from "vite";
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
				manualChunks: {
					'react': [
						'node_modules/react/index.js',
						'node_modules/react-dom/index.js'
					],
					'query': [
						'node_modules/@tanstack/react-query/build/lib/index.js',
					],
					'mui': [
						'node_modules/@mui/material/index.js',
					],
				},
			}
		}
	},
});
