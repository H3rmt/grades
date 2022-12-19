import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(),splitVendorChunkPlugin()],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	// prevent vite from obscuring rust errors
	clearScreen: false,
	// tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
	},
	// to make use of `TAURI_DEBUG` and other env variables
	// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,

		rollupOptions: {
			output: {
				// manualChunks: (id) => {
				// 	if (id.includes("node_modules")) {
				// 		if (id.includes("@mui")) {
				// 			return "mui";
				// 		} else if (id.includes("react")) {
				// 			return "react";
				// 		}
				// 		return "vendor";
				// 	}
				// },
			}
		}
	},
});
