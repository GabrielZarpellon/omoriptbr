const _GOMORI_Scene_OmoriTitleScreen_createVersionText = Scene_OmoriTitleScreen.prototype.createVersionText;
Scene_OmoriTitleScreen.prototype.createVersionText = function() {
	_GOMORI_Scene_OmoriTitleScreen_createVersionText.call(this);
	this._modVersion = new Sprite(new Bitmap(Math.ceil(Graphics.boxWidth / 4), 32));
	this.addChild(this._modVersion);
	let padding = 4;
	this._modVersion.position.set(0, 32);
	this._modVersion.bitmap.fontSize = 24;
	const gomoriVersion = $modLoader.mods.get("gomori").meta.version;
	this._modVersion.bitmap.drawText(`GOMORI V${gomoriVersion}`, padding ,padding , this._modVersion.bitmap.width, 16, "left");
}

Scene_OmoriTitleScreen.prototype.optionWindows = function() {
	return [this._generalOptionsWindow, this._audioOptionsWindow, this._controlOptionsWindow, this._systemOptionsWindow, this._modsOptionsWindow]
}

const _GOMORI_Scene_OmoriTitleScreen_create = Scene_OmoriTitleScreen.prototype.create;
Scene_OmoriTitleScreen.prototype.create = function() {
	this.createModsOptionsWindow();
	_GOMORI_Scene_OmoriTitleScreen_create.call(this);
	this._optionsWindowsContainer.addChild(this._modsOptionsWindow);
};

Scene_OmoriTitleScreen.prototype.createModsOptionsWindow = function() {
	// Create System Option Window
	this._modsOptionsWindow = new Window_OmoMenuOptionsMods();
	this._modsOptionsWindow.setHandler('cancel', this.onOptionWindowCancel.bind(this));
	this._modsOptionsWindow.visible = false;
};
