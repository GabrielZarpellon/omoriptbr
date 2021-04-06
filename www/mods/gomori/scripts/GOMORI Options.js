Scene_OmoMenuOptions.prototype.create = function() {
	// Super Call
	Scene_OmoMenuBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createStatusWindows();
	this.createGoldWindow();

	this.createGeneralOptionsWindow();
	this.createAudioOptionsWindow();
	this.createControllerOptionsWindow();
	this.createSystemOptionsWindow();
	this.createModsOptionsWindow();
	this.createOptionCategoriesWindow();
	// this.createHelpWindow();
	this.createCommandWindow();
	this.createExitPromptWindow();
};

//=============================================================================
// * Get All Option Windows
//=============================================================================
Scene_OmoMenuOptions.prototype.optionWindows = function() {
	return [this._generalOptionsWindow, this._audioOptionsWindow, this._controlOptionsWindow, this._systemOptionsWindow, this._modsOptionsWindow]
}

//=============================================================================
// * Create Mods Options Window
//=============================================================================
Scene_OmoMenuOptions.prototype.createModsOptionsWindow = function() {
	// Create System Option Window
	this._modsOptionsWindow = new Window_OmoMenuOptionsMods();
	this._modsOptionsWindow.x = 10;
	this._modsOptionsWindow.y = 10;
	this._modsOptionsWindow.setHandler('cancel', this.onOptionWindowCancel.bind(this));
	this._modsOptionsWindow.height = 0;
	this._modsOptionsWindow.visible = false;
	this.addChild(this._modsOptionsWindow);
};

const _GOMORI_Window_OmoMenuOptionsCategory_makeCommandList = Window_OmoMenuOptionsCategory.prototype.makeCommandList;
Window_OmoMenuOptionsCategory.prototype.makeCommandList = function() {
	_GOMORI_Window_OmoMenuOptionsCategory_makeCommandList.call(this);
	this.addCommand('MODS', 'ok');
};

Window_OmoMenuOptionsCategory.prototype.maxCols = function() { return 5; };



//=============================================================================
// ** Window_OmoMenuOptionsMods
//-----------------------------------------------------------------------------
// The window for GOMORI mods
//=============================================================================
function Window_OmoMenuOptionsMods() { this.initialize.apply(this, arguments); }
Window_OmoMenuOptionsMods.prototype = Object.create(Window_Selectable.prototype);
Window_OmoMenuOptionsMods.prototype.constructor = Window_OmoMenuOptionsMods;
//=============================================================================
// * Object Initialization
//=============================================================================
Window_OmoMenuOptionsMods.prototype.initialize = function() {
	// Make Options List
	this.makeOptionsList();
	// Super Call
	Window_Selectable.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
	this.createOptionCursors();
	this.select(0);
	// Refresh
	this.refresh();
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoMenuOptionsMods.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoMenuOptionsMods.prototype.standardPadding = function() { return 8; }
Window_OmoMenuOptionsMods.prototype.windowWidth = function () { return Graphics.width -  20; };
Window_OmoMenuOptionsMods.prototype.windowHeight = function() { return 318; }
Window_OmoMenuOptionsMods.prototype.maxItems = function() { return this._optionsList.length;};
Window_OmoMenuOptionsMods.prototype.maxCols = function() { return 1;};
Window_OmoMenuOptionsMods.prototype.itemHeight = function() { return 75; };
Window_OmoMenuOptionsMods.prototype.spacing = function() { return 5; };
Window_OmoMenuOptionsMods.prototype.customCursorRectXOffset = function() { return 15; }
Window_OmoMenuOptionsMods.prototype.customCursorRectYOffset = function() { return -18; }
//=============================================================================
// * Height
//=============================================================================
Object.defineProperty(Window_OmoMenuOptionsMods.prototype, 'height', {
	get: function() { return this._height; },
	set: function(value) {
		this._height = value;
		this._refreshAllParts();
	},
	configurable: true
});
//=============================================================================
// * Refresh Arrows
//=============================================================================
Window_OmoMenuOptionsMods.prototype._refreshArrows = function() {
	// Run Original Function
	Window_Selectable.prototype._refreshArrows.call(this);
	var w = this._width;
	var h = this._height;
	var p = 28;
	var q = p/2;
	this._downArrowSprite.move(w - q, h - q);
	this._upArrowSprite.move(w - q, q);
};
//=============================================================================
// * Create Option Cursors
//=============================================================================
Window_OmoMenuOptionsMods.prototype.createOptionCursors = function() {
	// Initialize Option Cursors
	this._optionCursors = [];
	// Create Cursor Sprites
	for (var i = 0; i < 4; i++) {
		// Create Sprite
		var sprite = new Sprite_WindowCustomCursor(undefined, this.customCursorRectBitmapName());
		sprite.deactivate();
		sprite.visible = false;
		sprite.setColorTone([-80, -80, -80, 255]);
		this._customCursorRectSpriteContainer.addChild(sprite);
		// Add Sprite to Option Cursors
		this._optionCursors[i] = sprite;
	};
};

Window_OmoMenuOptionsMods.prototype._updateArrows = function() {
	Window.prototype._updateArrows.call(this);
	this._downArrowSprite.visible = this._downArrowSprite.visible && !!this.active;
	this._upArrowSprite.visible = this._upArrowSprite.visible && !!this.active;
};
//=============================================================================
// * Make Options List
//=============================================================================
Window_OmoMenuOptionsMods.prototype.makeOptionsList = function() {
	// Initialize Options List
	this._optionsList = [];
	// Go through Options
	for (const mod of $modLoader.mods.values()) {
		// Create Option
		var option = { header: `${mod.meta.name} v${mod.meta.version}`, options: ["ON", "OFF"], helpText: mod.meta.description, spacing: 80, mod };
		option.index = $modLoader.config[mod.id] !== false ? 0 : 1
		// Add Option
		this._optionsList.push(option);
	};
}
//=============================================================================
// * Draw Item
//=============================================================================
Window_OmoMenuOptionsMods.prototype.drawItem = function(index) {
	// Get Item Rect
	var rect = this.itemRect(index);
	// Get Data
	var data = this._optionsList[index];
	// If Data Exists
	if (data) {
		// Draw Option Segment
		this.drawOptionSegment(data.header, data.options, data.spacing, rect);
	};
};
//=============================================================================
// * Draw Option Segment
//=============================================================================
Window_OmoMenuOptionsMods.prototype.drawOptionSegment = function(header, options, spacing, rect) {
	// Draw Header
	this.contents.drawText(header, rect.x + 50, rect.y, rect.width, 24);
	// Go Through Options
	for (var i = 0; i < options.length; i++) {
		// Draw Options
		this.contents.drawText(options[i], rect.x + (100 + (i * spacing)), rect.y + 35, rect.width, 24)
	};
};
//=============================================================================
// * Call Update Help
//=============================================================================
Window_OmoMenuOptionsMods.prototype.callUpdateHelp = function() {
	// Run Original Function
	Window_Selectable.prototype.callUpdateHelp.call(this);
	// If Help Window Exist
	if (this._helpWindow) {
		this._helpWindow.setText(this._optionsList[this.index()].helpText);
	};
};

//=============================================================================
// * Cursor Right
//=============================================================================
Window_OmoMenuOptionsMods.prototype.cursorRight = function(wrap) {
	// Super Call
	Window_Selectable.prototype.cursorRight.call(this, wrap);
	// Get Data
	var data = this._optionsList[this.index()];
	// Get Data
	if(this.index() === 0 && !Graphics._isFullScreen()) {
		SoundManager.playBuzzer();
		return;
	}
	if (data) {
		// Set Data Index
		data.index = (data.index + 1) % data.options.length;
		// Process Option Command
		this.processOptionCommand();
		// Update Cursor
		this.updateCursor();
	}
};
//=============================================================================
// * Cursor Left
//=============================================================================
Window_OmoMenuOptionsMods.prototype.cursorLeft = function(wrap) {
	// Super Call
	Window_Selectable.prototype.cursorLeft.call(this, wrap);
	// Get Data
	var data = this._optionsList[this.index()];
	// Get Data
	if(this.index() === 0 && !Graphics._isFullScreen()) {
		SoundManager.playBuzzer();
		return;
	}
	if (data) {
		// Get Max Items
		var maxItems = data.options.length;
		// Set Data Index
		data.index = (data.index - 1 + maxItems) % maxItems;
		// Process Option Command
		this.processOptionCommand();
		// Update Cursor
		this.updateCursor();
	};
};
//=============================================================================
// * Update Cursor
//=============================================================================
Window_OmoMenuOptionsMods.prototype.updateCursor = function() {
	// Run Original Function
	Window_Selectable.prototype.updateCursor.call(this);
	// Get Top Row
	var topRow = this.topRow();
	// Get Index
	var index = this.index();
	// If Option cursors Exist
	if (this._optionCursors) {
		// Go through Option Cursors
		for (var i = 0; i < this._optionCursors.length; i++) {
			// Get Sprite
			var sprite = this._optionCursors[i];
			// Get Real Index
			var realIndex = topRow + i;
			// Get Data
			var data = this._optionsList[realIndex];
			// Get Selected State
			var selected = this.active ? realIndex === index : false;
			// If Data Exists
			if (data) {
				// Get Item Rect
				var rect = this.itemRect(realIndex);
				// Set Sprite Color
				sprite.setColorTone(selected ? [0, 0, 0, 0] : [-80, -80, -80, 255])
				// Activate Selected Sprite
				selected ? sprite.activate() : sprite.deactivate();
				// Set Sprite Positions
				sprite.x = (rect.x + 65) +  (data.index * data.spacing);
				sprite.y = rect.y + 60;
				// Make Sprite Visible
				sprite.visible = this.height >= sprite.y + sprite.height;
			} else {
				// Deactivate Sprite
				sprite.deactivate();
				// Make Sprite Invisible
				sprite.visible = false;
			};
		};
	}
};
//=============================================================================
// * Process Option Command
//=============================================================================
Window_OmoMenuOptionsMods.prototype.processOptionCommand = function() {
	const fs = require("fs");
	const path = require("path");
	const base = path.dirname(process.mainModule.filename);

	// Get Index
	var index = this.index();
	// Get Data
	var data = this._optionsList[index];

	$modLoader.config[data.mod.id] = data.index === 0;
	fs.writeFileSync(`${base}/save/mods.json`, JSON.stringify($modLoader.config))
};
