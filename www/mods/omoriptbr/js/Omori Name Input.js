//=============================================================================
// TDS Omori Name Input
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_NameInput = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.NameInput = _TDS_.NameInput || {};
//=============================================================================
 /*:
 * @plugindesc
 * Name Input for OMORI
 *
 * @param Name Variable ID
 * @desc Variable ID to put the name text into.
 * @default 1
 *
 * @author TDS
 *
 * @help
 * ============================================================================
 * * Script Calls
 * ============================================================================
 *
 *
 *
 */
//=============================================================================
// Node.js path
var path = require('path');
// Get Parameters
var parameters = PluginManager.parameters("Omori Name Input");
// Initialize Parameters
_TDS_.NameInput.params = {};
_TDS_.NameInput.params.nameVariableID = Number(parameters['Name Variable ID'] || 0);


//=============================================================================
// ** Keyboard Input
//-----------------------------------------------------------------------------
// The static class that handles input data from the keyboard.
//=============================================================================
function KeyboardInput() { throw new Error('This is a static class'); }
//=============================================================================
// * Class Values
//=============================================================================
KeyboardInput.keyRepeatWait = 24;
KeyboardInput.keyRepeatInterval = 6;
//=============================================================================
// * Key Mapper
//=============================================================================
KeyboardInput.keyMapper = {
  8:  'backspace',
  13: 'enter',
//  16: 'shift',
  32: 'space',
  46: 'delete',
};
//=============================================================================
// * Object Initialization
//=============================================================================
KeyboardInput.initialize = function() {
  this.clear();
  this._wrapNwjsAlert();
  this._setupEventHandlers();
  // Set Caps Lock Flag
  this._capsLock = false;
};
//=============================================================================
// * Clear
//=============================================================================
KeyboardInput.clear = function() {
  this._keyDown = false;
  this._currentState = {};
  this._previousState = {};
  this._currentEvents = {};
  this._latestButton = null;
  this._latestEvent = null;
  this._pressedTime = 0;
  this._date = 0;
};
//=============================================================================
// * Setup Event Handlers
//=============================================================================
KeyboardInput._setupEventHandlers = function() {
  document.addEventListener('keydown', this._onKeyDown.bind(this));
  document.addEventListener('keyup', this._onKeyUp.bind(this));
  window.addEventListener('blur', this._onLostFocus.bind(this));
};
//=============================================================================
// * Frame Update
//=============================================================================
KeyboardInput.update = function() {
  if (this._currentState[this._latestButton]) {
    this._pressedTime++;
  } else {
    this._latestButton = null;
    this._latestEvent = null;
  }
  for (var name in this._currentState) {
    if (this._currentState[name] && !this._previousState[name]) {
      this._latestButton = name;
      this._latestEvent = this._currentEvents[name];
      this._pressedTime = 0;
      this._date = Date.now();
    };
    this._previousState[name] = this._currentState[name];
  };
};
//=============================================================================
// * Wrap NWjs Alert
//=============================================================================
KeyboardInput._wrapNwjsAlert = function() {
  if (Utils.isNwjs()) {
    var _alert = window.alert;
    window.alert = function() {
      var gui = require('nw.gui');
      var win = gui.Window.get();
      _alert.apply(this, arguments);
      win.focus();
      KeyboardInput.clear();
    };
  }
};
//=============================================================================
// * Determine if Default Should be prevented
//=============================================================================
KeyboardInput._shouldPreventDefault = function(keyCode) {
  switch (keyCode) {
  case 33:    // pageup
  case 34:    // pagedown
  case 37:    // left arrow
  case 38:    // up arrow
  case 39:    // right arrow
  case 40:    // down arrow
    return true;
  };
  return false;
};
//=============================================================================
// * On Key Down
//=============================================================================
KeyboardInput._onKeyDown = function(event) {
  // Set Caps Lock State
  this._capsLock = event.getModifierState('CapsLock');
  if (this._shouldPreventDefault(event.keyCode)) {
    event.preventDefault();
  };
  // Get Mapped
  var mapped = KeyboardInput.keyMapper[event.keyCode];
  // Get Button Name
  var buttonName = mapped ? mapped : String.fromCharCode(event.keyCode);
  // String.fromCharCode()
  // If Button Name Exists
  if (buttonName) {
    // Set Current Events
    this._currentEvents[buttonName] = event;
    // Set Button Name Curent State
    this._currentState[buttonName] = true;
  };
};
//=============================================================================
// * On Key Up
//=============================================================================
KeyboardInput._onKeyUp = function(event) {
  // Set Caps Lock State
  this._capsLock = event.getModifierState('CapsLock');
  // Get Mapped
  var mapped = KeyboardInput.keyMapper[event.keyCode];
  // Get Button Name
  var buttonName = mapped ? mapped : String.fromCharCode(event.keyCode);
  // If Button Name Exists
  if (buttonName) {
    // Set Button Name Curent State
    this._currentState[buttonName] = false;
  }
  if (event.keyCode === 0) {  // For QtWebEngine on OS X
    this.clear();
  };
};
//=============================================================================
// * On Lost Focus
//=============================================================================
KeyboardInput._onLostFocus = function() { this.clear(); };
//=============================================================================
// * Determine if Caps Lock is on
//=============================================================================
KeyboardInput.isCapsLockOn = function() { return this._capsLock; };
//=============================================================================
// * Is Triggered
//=============================================================================
KeyboardInput.isTriggered = function(keyName) {
  return this._latestButton === keyName && this._pressedTime === 0;
};
//=============================================================================
// * Is Repeated
//=============================================================================
KeyboardInput.isRepeated = function(keyName) {
  return (this._latestButton === keyName &&
          (this._pressedTime === 0 ||
           (this._pressedTime >= this.keyRepeatWait &&
            this._pressedTime % this.keyRepeatInterval === 0)));
};




//=============================================================================
// ** SceneManager
//-----------------------------------------------------------------------------
// The static class that manages scene transitions.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.NameInput.SceneManager_initInput       = SceneManager.initInput;
_TDS_.NameInput.SceneManager_updateInputData = SceneManager.updateInputData;
//=============================================================================
// * Initialize Input
//=============================================================================
SceneManager.initInput = function() {
  // Run Original Function
  _TDS_.NameInput.SceneManager_initInput.call(this);
  // Initialize Keyboard Input
  KeyboardInput.initialize();
};
//=============================================================================
// * Update Input Data
//=============================================================================
SceneManager.updateInputData = function() {
  // Run Original Function
  _TDS_.NameInput.SceneManager_updateInputData.call(this);
  // Update Keyboard Input
  KeyboardInput.update()
};



//=============================================================================
// ** Game_Interpreter
//-----------------------------------------------------------------------------
// The interpreter for running event commands.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.NameInput.Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
//=============================================================================
// * Show Name Input Window
//=============================================================================
Game_Interpreter.prototype.showNameInputWindows = function(name = "", max = 7, wait = true) {
  // Show Name Input Windows
  SceneManager._scene.showNameInputWindows(name, max);
  // Set Wait
  if (wait) { this.setWaitMode('nameInput'); };
};
//=============================================================================
// * Update Wait Mode
//=============================================================================
Game_Interpreter.prototype.updateWaitMode = function() {
  // If Wait mode is name input
  if (this._waitMode === 'nameInput') {
    if (SceneManager._scene.isInputWindowActive()) { return true; };
    return false;
  };
  // Return original function
  return _TDS_.NameInput.Game_Interpreter_updateWaitMode.call(this);
};



//=============================================================================
// ** Scene_Map
//-----------------------------------------------------------------------------
// The scene class of the map screen.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.NameInput.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows
//=============================================================================
// * Create All Windows
//=============================================================================
Scene_Map.prototype.createAllWindows = function() {
  // Run Original Function
  _TDS_.NameInput.Scene_Map_createAllWindows.call(this);
  // Create Quest Windows
  this.createNameInputWindows();
};
//=============================================================================
// * Create Name Input Windows
//=============================================================================
Scene_Map.prototype.createNameInputWindows = function() {
  // Create Name Input Window
  this._nameInputNameWindow = new Window_OmoriNameInputName();
  this._nameInputNameWindow.x = 70;
  this._nameInputNameWindow.y = 60
  this.addWindow(this._nameInputNameWindow);
  // Create Name Input Letter Window
  this._nameInputLetterWindow = new Window_OmoriInputLetters()
  this._nameInputLetterWindow.x = 70;
  this._nameInputLetterWindow.y = this._nameInputNameWindow.y + this._nameInputNameWindow.height + 2;
  this._nameInputLetterWindow._nameWindow = this._nameInputNameWindow;
  this.addChild(this._nameInputLetterWindow);
};
//=============================================================================
// * Show Name Input Windows
//=============================================================================
Scene_Map.prototype.showNameInputWindows = function(name, max) {
  this._nameInputNameWindow._maxCharacters = max;
  this._nameInputNameWindow.clearName(name);
  this._nameInputNameWindow.open();
  this._nameInputLetterWindow.open();
  this._nameInputLetterWindow.activate();
  this._nameInputLetterWindow.select(0);
};
//=============================================================================
// * Hide Name Input Windows
//=============================================================================
Scene_Map.prototype.hideNameInputWindows = function() {
  this._nameInputNameWindow.close();
  this._nameInputNameWindow.deactivate();
  this._nameInputLetterWindow.close();
  this._nameInputLetterWindow.deactivate();
};
//=============================================================================
// * Determine if Input Window is active
//=============================================================================
Scene_Map.prototype.isInputWindowActive = function() {
  return (this._nameInputNameWindow.openness > 0 || this._nameInputLetterWindow.active)
};



//=============================================================================
// ** Window_OmoriNameInputName
//-----------------------------------------------------------------------------
// This window displays the typed name.
//=============================================================================
function Window_OmoriNameInputName() { this.initialize.apply(this, arguments); }
Window_OmoriNameInputName.prototype = Object.create(Window_Base.prototype);
Window_OmoriNameInputName.prototype.constructor = Window_OmoriNameInputName;
//=============================================================================
// * Initialize Object
//=============================================================================
Window_OmoriNameInputName.prototype.initialize = function(max) {
  // Set Max Characters
  this._maxCharacters = max === undefined ? 7 : max;
  // Super Call
  Window_Base.prototype.initialize.call(this, 12, 12, this.windowWidth(), this.windowHeight());
  this.openness = 0;
  this.deactivate();
  // Clear Name
  this.clearName('');
  // Draw Contents
  this.refresh();
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriNameInputName.prototype.standardPadding = function() { return 4; };
Window_OmoriNameInputName.prototype.windowWidth = function() { return 170 + 10; };
Window_OmoriNameInputName.prototype.windowHeight = function() { return 80; };
//=============================================================================
// * Openness Type (0: Vertical, 1: Horizontal, 2: All)
//=============================================================================
Window_OmoriNameInputName.prototype.standardOpennessType = function() { return 2;};
//=============================================================================
// * Refresh
//=============================================================================
Window_OmoriNameInputName.prototype.refresh = function() {
  // Clear Contents
  this.contents.clear();
  this.contents.fontSize = 23
  this.contents.drawText('Qual é o nome dele?', 0, 1, this.contents.width, this.contents.fontSize, 'center');
  this.contents.fillRect(0, 32, this.contents.width, 2, 'rgba(255, 255, 255, 1)');
  // Refresh Text
  this.refreshText();
};
//=============================================================================
// * Refresh
//=============================================================================
Window_OmoriNameInputName.prototype.clearName = function(name) {
  // Initialize Array
  this._text = [];
  // Get Letters
  var letters = name.split("");
  // Go Through Max Characters
  for (var i = 0; i < this._maxCharacters; i++) {
    // Get Letter
    var letter = letters[i];
    // Add Letter
    this._text.push(letter ? letter : " ");
  };
  // Set Text Index
  this._textIndex = Math.max(letters.length - 1, 0);
  // Refresh Text
  this.refreshText();
};
//=============================================================================
// * Get Current Inputted Name
//=============================================================================
Window_OmoriNameInputName.prototype.name = function() { return this._text.join("").trim(); };
//=============================================================================
// * Add Letter
//=============================================================================
Window_OmoriNameInputName.prototype.add = function(character) {
  if (this._textIndex < this._maxCharacters) {
    this._text[this._textIndex] = character;
    this._textIndex = Math.min(this._textIndex + 1, this._maxCharacters-1)
    this.refreshText()
    return true
  };
  return false;
};
//=============================================================================
// * Back
//=============================================================================
Window_OmoriNameInputName.prototype.back = function() {
  if (this._textIndex > -1) {
    this._text[this._textIndex] = '';
    this._textIndex = Math.max(this._textIndex - 1, 0);
    this.refreshText();
    return true
  };
  return false;
};
//=============================================================================
// * Refresh Text
//=============================================================================
Window_OmoriNameInputName.prototype.refreshText = function() {
  // Clear Rect
  this.contents.clearRect(0, 34, this.contents.width, this.contents.height - 34);
  this.contents.fontSize = 28
  // Space width
  var width = 20;
  // Go Through Text
  for (var i = 0; i < this._text.length; i++) {
    // Get Letter
    var letter = this._text[i];
    var x = 6 + (i * (width + 3));
    var y = 34
    this.contents.drawText(letter, x, y, width, this.contents.fontSize, 'center');
    this.contents.paintOpacity = this._textIndex === i ? 255 : 100;
    this.contents.fillRect(x, y + this.contents.fontSize + 4, width, 2, 'rgba(255, 255, 255, 1)');
    this.contents.paintOpacity = 255;
  };
};
























//=============================================================================
// ** Window_OmoriInputLetters
//-----------------------------------------------------------------------------
// This window handles drawing of pictures and selection.
//=============================================================================
function Window_OmoriInputLetters() { this.initialize.apply(this, arguments); }
Window_OmoriInputLetters.prototype = Object.create(Window_Selectable.prototype);
Window_OmoriInputLetters.prototype.constructor = Window_OmoriInputLetters;
//=============================================================================
// * Initialize Object
//=============================================================================
Window_OmoriInputLetters.prototype.initialize = function() {
  // Super Call
  Window_Selectable.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
  this.refresh()
  this.openness = 0;
  this.deactivate();
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriInputLetters.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoriInputLetters.prototype.standardPadding = function() { return 4; };
Window_OmoriInputLetters.prototype.windowWidth = function() { return 500; };
Window_OmoriInputLetters.prototype.windowHeight = function() { return 250; };
Window_OmoriInputLetters.prototype.customCursorRectXOffset = function() { 
  if([58,59].contains(this.index())) {return -18;}
  return -12; 
};
Window_OmoriInputLetters.prototype.customCursorRectBitmapName = function() { return 'name_cursor'; }
Window_OmoriInputLetters.prototype.maxCols = function() { return 10; };
Window_OmoriInputLetters.prototype.maxItems = function() { return 60; };
//=============================================================================
// * Openness Type (0: Vertical, 1: Horizontal, 2: All)
//=============================================================================
Window_OmoriInputLetters.prototype.standardOpennessType = function() { return 2;};
//=============================================================================
// * Create Custom Cursor Rect
//=============================================================================
Window_OmoriInputLetters.prototype.initCustomCursorRect = function() {
  // Run Original Function
  Window_Selectable.prototype.initCustomCursorRect.call(this);
  // Change Cursor Animation Speed
  this._customCursorRectSprite.initCursorAnimation(0.15, 0.25);
};
//=============================================================================
// * Get Table
//=============================================================================
Window_OmoriInputLetters.prototype.table = function() {
  // Return Input Keys Table
  return LanguageManager.getInputKeysTable();
};
//=============================================================================
// * Get Selected Character
//=============================================================================
Window_OmoriInputLetters.prototype.character = function(index = this._index) {
  // Get Character
  return this.table()[index];
};
//=============================================================================
// * Item Rect
//=============================================================================
Window_OmoriInputLetters.prototype.itemRect = function(index) {
  var rect = new Rectangle(0, 0, 42, this.lineHeight());
  rect.x = 20 + (index % 10 * 42 + Math.floor(index % 10 / 5) * 24);
  rect.y = 10 + (Math.floor(index / 10) * this.lineHeight());
  // Return Rect
  return rect;
};
//=============================================================================
// * Refresh
//=============================================================================
Window_OmoriInputLetters.prototype.refresh = function() {
  // Get Table
  var table = this.table();
  this.contents.clear();
  this.resetTextColor();
  for (var i = 0; i < this.maxItems(); i++) {
    var rect = this.itemRect(i);
    this.drawText(table[i], rect.x, rect.y, rect.width, 'center');
  };
};
//=============================================================================
// * Cursor Down
//=============================================================================
Window_OmoriInputLetters.prototype.cursorDown = function(wrap) {
  // Get Next Character
  var nextChar = this.character(this._index + 10);
  if (nextChar === '') {
    return;
  };
  if (this._index < 60 || wrap) {
    this._index = (this._index + 10) % 60;
  };
  this.updateCursor();
};
//=============================================================================
// * Cursor Up
//=============================================================================
Window_OmoriInputLetters.prototype.cursorUp = function(wrap) {
  if (this._index <= 9) { 
    this._index += 50;
    // Get Next Character
    let nextChar = this.character(this._index);
    // If next character is empty
    if (nextChar === '') {
      for (var i = 0; i < this.maxRows(); i++) {
        var nC = this.character(this._index - 10);
        if (nC === undefined) { break; }
        if (nC !== '') { this._index -= 10; break;}
      };
    }
    this.updateCursor();    
    return;
  };

  if (this._index > 0 || wrap) {
    this._index = (this._index + 80) % 90;
  };
  // Update Cursor
  this.updateCursor();
};
//=============================================================================
// * Cursor Right
//=============================================================================
Window_OmoriInputLetters.prototype.cursorRight = function(wrap) {
  // Get Next Character
  var nextChar = this.character(this._index + 1);
  if (nextChar === '') {
    for (var i = 0; i < this.maxCols(); i++) {
      var nC = this.character(this._index + i + 1)
      if (nC === undefined) { break; }
      if (nC !== '') { this._index += (i + 1); break;}
    };
    this.updateCursor();
    return;
  };
  if (this._index % 10 < 9) {
    this._index++;
  } else if (wrap) {
    this._index -= 9;
  };
  this.updateCursor();
};
//=============================================================================
// * Cursor Left
//=============================================================================
Window_OmoriInputLetters.prototype.cursorLeft = function(wrap) {
  // Get Next Character
  var nextChar = this.character(this._index - 1);
  if (nextChar === '') {
    for (var i = 0; i < this.maxCols(); i++) {
      var nC = this.character(this._index - (i + 1))
      if (nC === undefined) { break; }
      if (nC !== '') { this._index -= (i + 1); break;}
    };
    this.updateCursor();
    return;
  };
  if (this._index % 10 > 0) {
    this._index--;
  } else if (wrap) {
    this._index += 9;
  };
  this.updateCursor();
};
//=============================================================================
// * Process Touch
//=============================================================================
Window_OmoriInputLetters.prototype.onTouch = function(triggered) {
  var lastIndex = this.index();
  var x = this.canvasToLocalX(TouchInput.x);
  var y = this.canvasToLocalY(TouchInput.y);
  var hitIndex = this.hitTest(x, y);
  if (hitIndex >= 0) {
      if (hitIndex === this.index()) {
        if (triggered && this.isTouchOkEnabled()) {
          this.processOk();
        }
      } else if (this.isCursorMovable()) {
        if (this.character(hitIndex) !== '') { this.select(hitIndex); };
      }
  } else if (this._stayCount >= 10) {
    if (y < this.padding) {
      this.cursorUp();
    } else if (y >= this.height - this.padding) {
      this.cursorDown();
    }
  }
  if (this.index() !== lastIndex) {
    SoundManager.playCursor();
  }
};
//=============================================================================
// * Process Handling
//=============================================================================
Window_OmoriInputLetters.prototype.processHandling = function() {
  if (this.isOpen() && this.active) {
    // if (KeyboardInput.isRepeated('enter')) {
    //   this.processOk();
    // };

    if (Input.isTriggered('ok')) {
      this.processOk();
    };

    if (Input.isTriggered('cancel')) {
      this.processBack();
    };
  };
};
//=============================================================================
// * Determine if OK
//=============================================================================
Window_OmoriInputLetters.prototype.isOk = function() { return this._index === 59; };
//=============================================================================
// * Determine if BackSpace
//=============================================================================
Window_OmoriInputLetters.prototype.isBackSpace = function() { return this._index === 58; };
//=============================================================================
// * Process Back
//=============================================================================
Window_OmoriInputLetters.prototype.processBack = function() {
  if (this._nameWindow) {
    if (this._nameWindow.back()) {
      SoundManager.playCancel();
    };
  };
};
//=============================================================================
// * Process Ok
//=============================================================================
Window_OmoriInputLetters.prototype.processOk = function() {
  // Get Character
  var character = this.character();
  if (this.isBackSpace()) {
    this.processBack();
  } else if (this.isOk()) {
    this.onNameOk();
  } else if (character) {
    if (this._nameWindow) {
      if (this._nameWindow.add(character)) {
        SoundManager.playOk();
      } else {
        SoundManager.playBuzzer();
      };
    };
  };

};
//=============================================================================
// * Process Handling
//=============================================================================
Window_OmoriInputLetters.prototype.onNameOk = function() {
  // Get Text
  var text = this._nameWindow.name();
  // If Text Length is more than 0
  if (text.length > 0) {
    if(text.toLowerCase() === "omocat") {$gameSystem.unlockAchievement("YOU_THINK_YOU_RE_CLEVER_HUH")}
    if (new RegExp($gameSystem._badWords.join("|")).test(text.toLowerCase())) { // YIN - Bad words check
      //console.log("That's totally inappropriate");
      this.playBuzzerSound();
      return;
    }
    //console.log("That is acceptable.")
    this.deactivate();
    this.close();
    this._nameWindow.close();
    if (_TDS_.NameInput.params.nameVariableID > 0) {
      $gameVariables.setValue(_TDS_.NameInput.params.nameVariableID, text);
    };
  } else {
    this.playBuzzerSound();
  };
};
//=============================================================================
// * Frame Update
//=============================================================================
Window_OmoriInputLetters.prototype.update = function() {
  // Super Call
  Window_Selectable.prototype.update.call(this);
  // Update Key Input
  this.updateKeyInput();
};
//=============================================================================
// * Update Key Input
//=============================================================================
Window_OmoriInputLetters.prototype.updateKeyInput = function() {
  return
  if (!this.isOpenAndActive()) { return; }
  // Get Key
  var key = KeyboardInput._latestButton;
  // Return if Key is null
  if (key === null) { return; }
  // If Backspace
  if (KeyboardInput.isRepeated('backspace')) {
    this.processBack();
    return;
  };
  // If Space
  if (KeyboardInput.isRepeated('space')) { return; };
  if (KeyboardInput.isRepeated('enter')) { return; };

  // Set UpperCase Flag
  var upperCase = Input.isPressed('shift');
  if (KeyboardInput.isCapsLockOn()) { upperCase = true; }
  // If Key is pressed
  if (KeyboardInput.isRepeated(key)) {
    // If Key is usable
    if (this.isKeyAlphabetical(key)) {
      // Convert key to lowercase if necessary
      key = upperCase ? key : key.toLowerCase();
      if (this._nameWindow) {
        if (this._nameWindow.add(key)) {
          SoundManager.playOk();
        } else {
          SoundManager.playBuzzer();
        };
      };
    };
  };
};
//=============================================================================
// * Determine if key is Alphabetical
//=============================================================================
Window_OmoriInputLetters.prototype.isKeyAlphabetical = function(key) { return /^[a-z ]*$/i.test(key); };
