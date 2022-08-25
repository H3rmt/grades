import {BaseDirectory, createDir, writeFile} from "@tauri-apps/api/fs";

const createDataFolder = async () => {
	try {
		await createDir("grades", {
			dir: BaseDirectory.Data,
			recursive: true,
		});
	} catch (e) {
		console.error(e);
	}
};

const createDataFile = async () => {
	try {
		await writeFile(
				{
					contents: "[]",
					path: `./grades/data.json`,
				},
				{
					dir: BaseDirectory.Data,
				}
		);
	} catch (e) {
		console.log(e);
	}
};
