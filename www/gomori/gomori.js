let $modLoader = null;

(() => {
	try {
		const ModLoader = require("./gomori/lib/ModLoader");

		const modLoader = new ModLoader(window.$plugins, window.Decrypter);
		$modLoader = modLoader;
		modLoader.loadAssetEncryptionKey();
		modLoader.injectCode(window);
		/*
		 * The mod loader takes every mod through 4 stages; loading -> building -> unpatching -> patching.
		 * The loading stage is responsible for registering the available mods and loading their metadata into the mod loader.
		 * The building stage is responsible for determining a patching strategy for the mod loader. This stage is used to map out which mod files are patched to where, if at all.
		 * The unpatching stage is responsible for unpatching BASIL files and registering which files will be unpatched in the next unpatching stage, based on the patching strategy determined by the building phase.
		 * The patching stage is responsible for executing the patching strategy determined by the building stage. It copies and encrypts files, creates BASIL rollback files for the unpatching stage, and executes in-memory scripts.
		 * For disabled mods, the patching stage is skipped. All other stages are always executed.
		 */
		modLoader.loadMods();
		modLoader.buildMods();
		modLoader.unpatchMods();
		modLoader.patchMods();
	} catch (err) {
		alert(`GOMORI encountered a critical error: ${err.stack}`);
	}
})()
