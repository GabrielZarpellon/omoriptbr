const crypto = require("crypto");

const ALGORITHM = "aes-256-ctr";
const KEY = String(window.nw.App.argv).replace("--", "");

function encryptBuffer (buf, iv) {
	const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
	const encryptedBuffer = Buffer.concat([iv, cipher.update(buf), cipher.final()]);
	return encryptedBuffer;
}

function encrypt (data, encryptedData) {
	const iv = encryptedData ? encryptedData.slice(0, 16) : Buffer.alloc(16);
	return encryptBuffer(data, iv);
}

function decryptBuffer (encryptedBuffer) {
	const iv = encryptedBuffer.slice(0, 16);
	encryptedBuffer = encryptedBuffer.slice(16);
	const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
	const buffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
	return buffer;
}

function encryptAssetBuffer (buf, header, key) {
	for (let i = 0; i < 16; i++) {
		buf[i] = buf[i] ^ key[i];
	}

	const encryptedBuffer = Buffer.concat([header, buf]);
	return encryptedBuffer;
}

function decryptSteam(data) {
	// get initialization vectors
	const iv = data.slice(0,16);

	data = data.slice(16);

	// create decipher
	const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

	// return decrypted data
	return Buffer.concat([decipher.update(data), decipher.final()]);
}

module.exports = { encryptBuffer, encrypt, decryptBuffer, encryptAssetBuffer, decryptSteam };
