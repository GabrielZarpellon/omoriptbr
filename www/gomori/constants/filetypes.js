/**
 * @typedef {Object} FileType
 * @property {string} encrypted - The file extension of encrypted variants of this file type. When defined, enables encryption when building.
 * @property {string} decrypted - The file extension of decrypted variants of this file type.
 * @property {string} dir - The directory files of this type should be patched to. When undefined, files are patched relative to their position in the mod folder.
 * @property {boolean} conflicts - When set to true, enforces conflict checking for files of this type and prevents mods from patching the same files.
 * @property {boolean} patch - Enables files to be patched in the patching phase.
 * @property {boolean} delta - Enables delta patching in the patching phase.
 * @property {boolean} require - Uses CommonJS require to import and execute the mod file during the patching phase.
 * @property {object} map - Object mapping decrypted file extensions as keys to encrypted file extensions as values. Unique to types with `asset` set to true.
 * @property {boolean} asset - Boolean indicating whether or not this file should be treated as an (rpgmv) asset.
 */

/**
 * Available File Types
 * @type {Object.<string, FileType>}
 */
const FILE_TYPE_MAP = {
	plugins: { encrypted: "OMORI", decrypted: "js", dir: "js/plugins", conflicts: true, patch: true, delta: false },
	text: { encrypted: "HERO", decrypted: "yml", dir: "languages/en", conflicts: true, patch: true, delta: false },
	data: { encrypted: "KEL", decrypted: "json", dir: "data", conflicts: true, patch: true, delta: false },
	data_pluto: { encrypted: "PLUTO", decrypted: "yaml", dir: "data", conflicts: true, patch: true, delta: false },
	maps: { encrypted: "AUBREY", decrypted: "json", dir: "maps", conflicts: true, patch: true, delta: false },
	assets: { conflicts: true, patch: true, delta: false, map: { "png": "rpgmvp", "ogg": "rpgmvo" }, asset: true },
	exec: { conflicts: false, require: true, patch: false },
	plugins_delta: { encrypted: "OMORI", decrypted: "jsd", dir: "js/plugins", conflicts: false, patch: false, delta: true },
	text_delta: { encrypted: "HERO", decrypted: "ymld", dir: "languages/en", conflicts: false, patch: true, delta: true },
	data_delta: { encrypted: "KEL", decrypted: "jsond", dir: "data", conflicts: false, patch: true, delta: true },
	maps_delta: { encrypted: "AUBREY", decrypted: "jsond", dir: "maps", conflicts: false, patch: true, delta: true },
};

const PROTECTED_FILES = [
	"js/libs/pixi.js",
	"js/libs/pixi-tilemap.js",
	"js/libs/pixi-picture.js",
	"js/libs/lz-string.js",
	"js/libs/iphone-inline-video.browser.js",
	"js/rpg_core.js",
	"js/rpg_managers.js",
	"js/rpg_objects.js",
	"js/rpg_scenes.js",
	"js/rpg_sprites.js",
	"js/rpg_windows.js",
	"js/plugins.js",
	"gomori/gomori.js",
	"js/main.js",
];

module.exports = { FILE_TYPE_MAP, PROTECTED_FILES };
