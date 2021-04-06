const Mod = require("./Mod");
const { defaultConfig } = require("../constants/defaults");
const { exists, read, write, readDir } = require("../utils/fs");
const { decryptBuffer } = require("../utils/encryption");

const fs = require("fs");
const path = require("path");

class ModLoader {
	constructor(plugins, Decrypter) {
		this.plugins = plugins;
		this.Decrypter = Decrypter;
		this.assetEncryptionKey = null;
		this.conflictFiles = new Set();
		this.deltaFiles = new Set();
		this.mods = new Map();
		this._config = null;
		this.deltaPlugins = new Map();
	}

	loadAssetEncryptionKey () {
		const encryptedSystem = read("data/System.KEL");
		const system = JSON.parse(decryptBuffer(encryptedSystem).toString());
		const keyHexStrings = system.encryptionKey.split(/(.{2})/).filter(Boolean);
		const keyBytes = keyHexStrings.map(hexString => parseInt(hexString, 16));
		this.assetEncryptionKey = Buffer.from(keyBytes);
	}

	/**
	 * @param window The global window object, which is only accessible from root scripts, and not from modules. We need this to do the code injection.
	 */
	injectCode(window) {
		//These are code overrides, which are used for injecting delta patches into plugins
		const modLoader = this;
		const doc = window.document;
		window.PluginManager = class extends window.PluginManager {
			static loadScript(name) {
				try {
				if(name.includes("vorbis")) {return super.loadScript(name)}
				name = name.replace(".js", ".OMORI").replace(".JS", ".OMORI");
				var base = path.dirname(process.mainModule.filename);
				let buff = fs.readFileSync(base + "/" + this._path + name);
				var url = this._path + name;
				var script = doc.createElement('script');
				script.type = 'text/javascript';

				//Delta loading code
				let delta = "\n";
				{
					const fullPath = this._path + name.replace(".js", ".OMORI").replace(".JS", ".OMORI");
					if (modLoader.deltaPlugins.has(fullPath)) {
						for (const patch of modLoader.deltaPlugins.get(fullPath)) {
							delta += patch.read().toString() + "\n";
						}
					}
				}

				script.innerHTML = decryptBuffer(buff).toString() + delta;
				script._url = url;
				doc.body.appendChild(script);
				} catch (err) {
					alert(`${err.stack}`);
				}
			}
		}
	}

	loadMods() {
		const mods = readDir("mods");
		for (const modDir of mods) {
			const isZip = modDir.endsWith(".zip");
			const id = modDir.replace(".zip", "");
			if (id.startsWith("_")) continue;

			if (this.mods.has(id)) {
				alert(`Cannot load mod "${modDir}" for having a conflicting ID.`);
				continue;
			}

			const mod = new Mod(this, id, isZip);
			this.mods.set(id, mod);
			mod.load();
		}
	}

	buildMods() {
		for (const mod of this.mods.values()) {
			try {
				mod.build();
			} catch (err) {
				alert(`Failed to build mod "${mod.id}": ${err.stack}`);
			}
		}
	}

	unpatchMods() {
		for (const file of this.config._basilFiles) {
			if (!exists(file)) continue;

			const basilBuf = read(file);
			write(file.replace(".BASIL", ""), basilBuf);
		}

		this.config._basilFiles = [...this.conflictFiles].map(file => `${file}.BASIL`).concat([...this.deltaFiles].map(file=> `${file}.BASIL`));
		write("save/mods.json", JSON.stringify(this.config));
	}

	patchMods() {
		for (const mod of this.mods.values()) {
			try {
				if (this.config[mod.id] !== false) mod.patch();
			} catch (err) {
				alert(`Failed to patch mod "${mod.id}": ${err.stack}`);
			}
		}
	}

	fileConflictCheck(filePath) {
		if (this.conflictFiles.has(filePath)) return true;
		if (this.deltaFiles.has(filePath)) return true;
		this.conflictFiles.add(filePath);
		return false;
	}

	fileConflictCheckDelta(filePath) {
		if (this.conflictFiles.has(filePath)) return true;
		if (!this.deltaFiles.has(filePath)) {
			this.deltaFiles.add(filePath);
		}
		return false;
	}


	get config() {
		if (this._config) return this._config;

		if (!exists("save/mods.json")) write("save/mods.json", JSON.stringify(defaultConfig));
		this._config = JSON.parse(read("save/mods.json").toString());
		if (!this._config._basilFiles) this._config._basilFiles = [];
		return this._config;
	}
}

module.exports = ModLoader;
