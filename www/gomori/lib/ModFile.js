const path = require("path");
const { PROTECTED_FILES } = require("../constants/filetypes");
const { encrypt, decryptBuffer } = require("../utils/encryption");
const { read, write, exists, remove } = require("../utils/fs");
const { deltaPatchYml, deltaPatchJson } = require("../utils/delta");

class ModFile {
	constructor(mod, path, type) {
		this.mod = mod;
		this.path = path;
		this.type = type;
		this.isPatched = this.type.patch && exists(this.basilPath);

		this.encryptedBuffer = null;
		this.decryptedBuffer = null;
	}

	read() {
		if (this.mod.zip) return this._readZip();
		return read(`mods/${this.mod.id}/${this.path}`);
	}

	_readZip() {
		return this.mod.zip.read(`${this.mod.id}/${this.path}`);
	}

	build() {
		if (this.type.patch && PROTECTED_FILES.includes(this.patchPath)) throw new Error(`Mod ${this.mod.id} attempted to patch protected file ${this.patchPath}`);

		this.decryptedBuffer = this.read();
		// Delta files don't get built, because that needs to be done during patch time.
		if (!this.type.delta) this._buildSimple();
		else this._buildDelta();
	}

	_buildSimple() {
		if (this.type.encrypted) this.encryptedBuffer = encrypt(this.decryptedBuffer, this.unpatchedEncryptedBuffer);
		else this.encryptedBuffer = this.decryptedBuffer;
	}

	_buildDelta() {
		if (this.type.decrypted == "jsd") {
			const deltaMap = this.mod.modLoader.deltaPlugins;
			if (!deltaMap.has(this.patchPath)) {
				deltaMap.set(this.patchPath, new Set());
			}
			deltaMap.get(this.patchPath).add(this);
		}
	}

	_patchDelta() {
		if (this.type.decrypted == "jsd") {
			return;
			//No need to patch .jsd files, it's done during plugin load time.
		} else if (this.type.decrypted == "ymld") {
			this.decryptedBuffer = deltaPatchYml(this.decryptedBuffer, decryptBuffer(this.probablyPatchedEncryptedBuffer));
		} else if (this.type.decrypted == "jsond") {
			this.decryptedBuffer = deltaPatchJson(this.decryptedBuffer, decryptBuffer(this.probablyPatchedEncryptedBuffer));
		} else {
			throw new Error(`Failed to patch file "${this.path}" for mod "${this.mod.id}": Unsupported delta file type "${this.type.decrypted}".`);
		}
		this.encryptedBuffer = encrypt(this.decryptedBuffer)
	}

	patch() {
		if (this.type.patch && exists(this.patchPath)) write(this.basilPath, this.unpatchedEncryptedBuffer);
		if (this.type.encrypted === "OMORI" && !this.mod.modLoader.plugins.some(({ name }) => name === this.pluginMeta.name)) this.mod.modLoader.plugins.push(this.pluginMeta);
		if (this.type.patch) {
			if (this.type.delta) {
				this._patchDelta();
			}
			write(this.patchPath, this.encryptedBuffer);
		}
		if (this.type.require) {
			try {
				const func = this.require();
				if (typeof func === "function") func();
			} catch (err) {
				throw new Error(`Failed to execute file "${this.path}" for mod "${this.mod.id}": ${err.stack}`);
			}
		}
		this.isPatched = true;
	}

	require() {
		const base = path.dirname(process.mainModule.filename);

		const tempFile = `exec.${this.mod.id}.${this.path.replace(/\//g, ".")}.js`;
		write(tempFile, this.decryptedBuffer);
		const exportData = require(`${base}/${tempFile}`);
		remove(tempFile);
		return exportData;
	}

	unpatch() {
		if (!this.isPatched) return;
		write(this.patchPath, this.unpatchedEncryptedBuffer);
		this.isPatched = false;
	}

	get pluginMeta() {
		return {
			name: this.fileName.replace(`.${this.type.decrypted}`, ""),
			status: true,
			description: `Patched by GOMORI | Plugin file for mod "${this.mod.id}"`,
			parameters: {},
		}
	}

	get fileExtension() {
		return path.extname(this.path).substring(1);
	}

	get fileName() {
		return this.path.split("/")[this.path.split("/").length - 1];
	}

	get patchPath() {
		let patchPath = this.path;

		if (this.type.dir) patchPath = `${this.type.dir}/${this.fileName}`;
		if (this.type.encrypted && this.type.decrypted) patchPath = patchPath.replace(`.${this.type.decrypted}`, `.${this.type.encrypted}`);

		if (patchPath.startsWith("/")) patchPath = patchPath.substring(1);
		return patchPath;
	}

	get basilPath() {
		return `${this.patchPath}.BASIL`;
	}

	get unpatchedEncryptedBuffer() {
		const path = this.isPatched ? this.basilPath : this.patchPath;
		if (!exists(path)) return null;
		return read(path);
	}

	/**
	 * @returns The file currently present in the game's folder. This is ONLY used for DELTA patching, and SHOULD NOT used be anywhere else for stability reasons.
	 */
	get probablyPatchedEncryptedBuffer() {
		const path = this.patchPath;
		if (!exists(path)) return null;
		return read(path);
	}
}

module.exports = ModFile;
