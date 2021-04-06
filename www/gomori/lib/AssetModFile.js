const ModFile = require("./ModFile");
const { encrypt, encryptAssetBuffer } = require("../utils/encryption");

class AssetModFile extends ModFile {
	 _buildSimple() {
		 if (this.type.encrypted === this.fileExtension) this.encryptedBuffer = encrypt(this.decryptedBuffer, this.unpatchedEncryptedBuffer);
		 else if (this.type.map && this.type.map[this.fileExtension]) this.encryptedBuffer = encryptAssetBuffer(this.decryptedBuffer, this.headerBytes, this.mod.modLoader.assetEncryptionKey);
		 else this.encryptedBuffer = this.decryptedBuffer;
	}

	get patchPath() {
	 	let patchPath = super.patchPath;

	 	if (this.type.map && this.type.map[this.fileExtension]) patchPath = patchPath.replace(`.${this.fileExtension}`, `.${this.type.map[this.fileExtension]}`);

	 	return patchPath;
	}

	get headerBytes() {
		const { SIGNATURE: sig, VER: ver, REMAIN: rem } = this.mod.modLoader.Decrypter;
		const hexHeader = sig + ver + rem;

		const headerHexStrings = hexHeader.split(/(.{2})/).filter(Boolean);
		const headerBytes = headerHexStrings.map(hexString => parseInt(hexString, 16));

		return Buffer.from(headerBytes);
	}
}

module.exports = AssetModFile;
