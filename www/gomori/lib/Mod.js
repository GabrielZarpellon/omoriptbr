const AdmZip = require("../../adm-zip-0.5.1/adm-zip");

const { FILE_TYPE_MAP } = require("../constants/filetypes");
const { exists, read, isDir, readDir, rename, remove } = require("../utils/fs");
const ModFile = require("./ModFile");
const AssetModFile = require("./AssetModFile");
const ModZip = require("./ModZip");

class Mod {
	constructor(modLoader, id, isZip) {
		this.modLoader = modLoader;
		this.id = id;
		this.isZip = isZip;
		this.zip = null;
		this.meta = null;
		this.files = new Map();
	}

	load() {
		return this.isZip ? this._loadZip() : this._loadFolder();
	}

	build() {
		for (const [type, fileType] of Object.entries(FILE_TYPE_MAP)) {
			const files = this.meta.files[type];
			if (!files) continue;
			for (const file of files) {
				if (file.endsWith("/")) this.buildDir(file, fileType);
				else this.buildFile(file, fileType);
			}
		}
	}

	buildDir(path, type) {
		if (this.isZip) return this.buildZipDir(path, type);

		const files = readDir(`mods/${this.id}/${path}`);
		for (const file of files) {
			if (isDir(`mods/${this.id}/${path}${file}`)) continue;
			this.buildFile(`${path}${file}`, type);
		}
	}

	buildZipDir(path, type) {
		path = `${this.id}/${path}`;
		const entries = this.zip.getEntries()
			.filter(({ entryName }) => {
				// Filter for children of dir and exclude deeper dirs to avoid recursive lookup
				return entryName.startsWith(path) && !entryName.replace(path, "").includes("/") && entryName !== path;
			});
		for (const { entryName } of entries) {
			this.buildFile(entryName.replace(`${this.id}/`, ""), type);
		}
	}

	buildFile(path, type) {
		const modFile = type.asset ? new AssetModFile(this, path, type) : new ModFile(this, path, type);
		modFile.build();
		this.files.set(modFile.patchPath, modFile);
		if (this.enabled &&
			((type.conflicts === true && this.modLoader.fileConflictCheck(modFile.patchPath))
			||(type.delta === true && this.modLoader.fileConflictCheckDelta(modFile.patchPath))))
			throw new Error(`Failed to build mod ${this.id} due to conflicted file ${path}.`);
	}

	unpatch() {
		for (const modFile of this.files.values()) {
			modFile.unpatch();
		}
	}

	patch() {
		for (const modFile of this.files.values()) {
			modFile.patch();
		}
	}

	get enabled() {
		return this.modLoader.config[this.id] !== false;
	}

	_loadZip() {
		const path = require("path");
		const base = path.dirname(process.mainModule.filename);
		this.zip = new ModZip(`${base}/mods/${this.id}.zip`);

		this._autoCorrectZipFile(base);
		this.meta = JSON.parse(this.zip.read(`${this.id}/mod.json`));
		return this.meta;
	}

	_loadFolder() {
		this._autoCorrectModFolder();
		const buf = read(`mods/${this.id}/mod.json`);
		this.meta = JSON.parse(buf.toString());
		return this.meta;
	}
	
	//This function fixes the most common mod problem asked in #modding-discussion, which is caused by people incorrectly extracting zip files. (Plus it also gives descriptive errors on edge cases).
	_autoCorrectModFolder() {
		const rootFolder = `mods/${this.id}`;
		if (!exists(`${rootFolder}/mod.json`)) {
			//No mod.json, so check for the most common problem: incorrectly extracted folder.
			if (exists(`${rootFolder}/${this.id}/mod.json`)) {
				const meta = JSON.parse(read(`${rootFolder}/${this.id}/mod.json`));
				if (this.id != meta.id) {
					throw new Error(`Rename the ${this.id} folder inside www/mods to ${meta.id} so that it matches it's mod id, otherwise it cannot be loaded!`);
				}
				//The mod was extracted incorrectly, but maybe not, so we need to check if the folder only has that single folder
				if (readDir(rootFolder).length == 1) {
					//Before we begin moving the files, however, check if it has a 3rd nested folder matching the mod name. If it has, then fail, because we may potentially overwrite files.
					if (exists(`${rootFolder}/${this.id}/${this.id}`)) {
						throw new Error(`Mod ${this.id} has an unfixable folder structure, and cannot be loaded.`);
					}
					
					//If we got here, that means that the problem was just a mis-extracted folder, and we can automatically correct it, however, a popup will notify the user on how to avoid this problem.

					readDir(`${rootFolder}/${this.id}`).forEach(file => {
						rename(`${rootFolder}/${this.id}/${file}`, `${rootFolder}/${file}`);
					});
					remove(`${rootFolder}/${this.id}`);
					alert(`Mod ${this.id} had an incorrect folder structure, but has been fixed successfully. This is NOT an error, just a notification, no need to ask for help.`)
					//If we got here, then the folder is valid :)
					return;	
				}
				throw new Error(`Mod ${this.id} was incorrectly extracted, but it contains files in its root folder, so it cannot be automatically corrected.`);
			}
			//This error also tells the user that they shouldn't have two folders inside the mod folder.
			throw new Error(`Could not find www/mods/${this.id}/mod.json!`);
		} else {
			const meta = JSON.parse(read(`${rootFolder}/mod.json`));
			if (this.id != meta.id) {
				throw new Error(`Rename the ${this.id} folder inside www/mods to ${meta.id} so that it matches it's mod id, otherwise it cannot be loaded!`);
			}
		}
		//If we got here, then the folder is valid :)
	}

	//This function fixes rare structure problems that may happen if a mod's developer incorrectly compresses a mod into a zip file.
	_autoCorrectZipFile(base) {
		//Check if the archive has the nested folder inside it
		if (!this.zip.exists(`${this.id}/mod.json`)) {
			//It doesn't have the nested folder. Check if the mod.json is in the root
			if (this.zip.exists("mod.json")) {
				const meta = JSON.parse(this.zip.read("mod.json"));
				const files = this.zip.getFilePaths();
				const dirs = this.zip.getDirPaths();
				//Transfer files into the subfolder
				files.forEach((entryName) => {
					this.zip.write(`${meta.id}/${entryName}`, this.zip.read(entryName));
					this.zip.delete(entryName);
				});
				//Remove dangling empty folders
				dirs.forEach((dirName) => {
					this.zip.delete(dirName, true);
				})

				//Write back the autocorrected zip contents
				this.zip.writeZip();

				//Finally, if the archive has an invalid filename, then tell the user to rename it (we don't do it in code because it can confuse users)
				if (this.id != meta.id) {
					throw new Error(`The ${this.id}.zip mod has an incorrect filename. Rename it to ${meta.id}.zip so that it matches it's mod id!`);
				}
			} else {
				throw new Error(`Could not find neither /${this.id}/mod.json nor /mod.json inside ${this.id}.zip. Note: The zip file's name must be identical to it's mod id!`);
			}
		}
		//If we got here, then the zip is valid :)
	}
}

module.exports = Mod;
