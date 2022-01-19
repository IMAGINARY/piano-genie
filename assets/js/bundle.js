(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _qs = _interopRequireDefault(require("qs"));

var _pianoGenie = require("./piano-genie");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var defaultConfig = {
  defaultLanguage: 'en',
  showInfoButton: true,
  showConfigButton: true,
  showFullScreenButton: true,
  showInputKeys: true,
  showInputKeysText: true,
  showInputInstructions: true,
  keyCount: 8,
  input: 'keyboard',
  output: 'wave'
};
/**
 * Loads the config file from an external JSON file
 *
 * @param {String} uri
 * @return {Promise<any>}
 */

function loadConfig(_x) {
  return _loadConfig.apply(this, arguments);
}
/**
 * Load config files and start the program
 */


function _loadConfig() {
  _loadConfig = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uri) {
    var response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetch(uri, {
              cache: 'no-store'
            });

          case 2:
            response = _context2.sent;

            if (!(response.status >= 200 && response.status < 300)) {
              _context2.next = 13;
              break;
            }

            _context2.prev = 4;
            _context2.next = 7;
            return response.json();

          case 7:
            return _context2.abrupt("return", _context2.sent);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](4);
            throw new Error("Error parsing config file: ".concat(_context2.t0.message));

          case 13:
            if (!(response.status === 404)) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("return", {});

          case 15:
            throw new Error("Server returned status ".concat(response.status, " (").concat(response.statusText, ") loading config file."));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 10]]);
  }));
  return _loadConfig.apply(this, arguments);
}

(function () {
  var _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var qsArgs, config;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            qsArgs = _qs["default"].parse(window.location.search, {
              ignoreQueryPrefix: true
            });
            _context.t0 = Object;
            _context.t1 = {};
            _context.t2 = defaultConfig;
            _context.next = 7;
            return loadConfig('./config.json');

          case 7:
            _context.t3 = _context.sent;
            config = _context.t0.assign.call(_context.t0, _context.t1, _context.t2, _context.t3);

            if (qsArgs.embed !== undefined) {
              config.embedMode = true;
            }

            _context.next = 12;
            return IMAGINARY.i18n.init({
              queryStringVariable: 'lang',
              translationsDirectory: 'tr',
              defaultLanguage: config.defaultLanguage || 'en'
            });

          case 12:
            (0, _pianoGenie.initPianoGenie)(config);
            document.querySelectorAll('[data-i18n-field]').forEach(function (element) {
              element.innerHTML = IMAGINARY.i18n.t(element.getAttribute('data-i18n-field'));
            });
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t4 = _context["catch"](0);
            // eslint-disable-next-line no-console
            console.error(_context.t4);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  function main() {
    return _main.apply(this, arguments);
  }

  return main;
})()();

},{"./piano-genie":2,"qs":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPianoGenie = initPianoGenie;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* globals IMAGINARY */
function initPianoGenie(options) {
  var CONSTANTS = {
    COLORS: ['#db4c67', '#ff8459', '#ffec02', '#73ff6c', '#00c5ba', '#3753be', '#9c52ff', '#ef71f2'],
    NUM_BUTTONS: 8,
    NOTES_PER_OCTAVE: 12,
    WHITE_NOTES_PER_OCTAVE: 7,
    LOWEST_PIANO_KEY_MIDI_NOTE: 21,
    NUM_NOTES: 88,
    GENIE_CHECKPOINT: 'model/genie'
  };
  /*************************
   * MIDI or Magenta player
   ************************/

  var Player = /*#__PURE__*/function () {
    function Player() {
      _classCallCheck(this, Player);

      this.player = new mm.SoundFontPlayer('vendor/sgm_plus');
      this.midiOut = [];
      this.midiIn = [];
      this.usingMidiOut = false;
      this.usingMidiIn = false;
      this.selectOutElement = document.getElementById('selectOut');
      this.selectInElement = document.getElementById('selectIn');
      this.loadAllSamples();
    }

    _createClass(Player, [{
      key: "loadAllSamples",
      value: function loadAllSamples() {
        var seq = {
          notes: []
        };

        for (var i = 0; i < CONSTANTS.NUM_NOTES; i++) {
          seq.notes.push({
            pitch: CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + i
          });
        }

        this.player.loadSamples(seq);
      }
    }, {
      key: "playNoteDown",
      value: function playNoteDown(pitch, button) {
        // Send to MIDI out or play with the Magenta player.
        if (this.usingMidiOut) {
          this.sendMidiNoteOn(pitch, button);
        } else {
          mm.Player.tone.context.resume();
          this.player.playNoteDown({
            pitch: pitch
          });
        }
      }
    }, {
      key: "playNoteUp",
      value: function playNoteUp(pitch, button) {
        // Send to MIDI out or play with the Magenta player.
        if (this.usingMidiOut) {
          this.sendMidiNoteOff(pitch, button);
        } else {
          this.player.playNoteUp({
            pitch: pitch
          });
        }
      } // MIDI bits.

    }, {
      key: "midiReady",
      value: function midiReady(midi) {
        var _this = this;

        // Also react to device changes.
        midi.addEventListener('statechange', function (event) {
          return _this.initDevices(event.target);
        });
        this.initDevices(midi);
      }
    }, {
      key: "initDevices",
      value: function initDevices(midi) {
        var _this2 = this;

        this.midiOut = [];
        this.midiIn = [];
        var outputs = midi.outputs.values();

        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
          this.midiOut.push(output.value);
        }

        var inputs = midi.inputs.values();

        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          this.midiIn.push(input.value); // TODO: should probably use the selected index from this.selectInElement for correctness
          // but i'm hacking this together for a demo so...

          input.value.onmidimessage = function (msg) {
            return _this2.getMIDIMessage(msg);
          };
        } // No MIDI, no settings.
        //btnSettings.hidden = (this.midiOut.length === 0 && this.midiIn.length === 0);


        this.selectInElement.innerHTML = this.midiIn.map(function (device) {
          return "<option>".concat(device.name, "</option>");
        }).join('');
        this.selectOutElement.innerHTML = this.midiOut.map(function (device) {
          return "<option>".concat(device.name, "</option>");
        }).join('');
      }
    }, {
      key: "sendMidiNoteOn",
      value: function sendMidiNoteOn(pitch, button) {
        // -1 is sent when releasing the sustain pedal.
        if (button === -1) button = 0; //const msg = [0x90 + button, pitch, 0x7f];    // note on, full velocity.

        var msg = [0x90, pitch, 0x7f]; // note on, full velocity.

        this.midiOut[this.selectOutElement.selectedIndex].send(msg);
      }
    }, {
      key: "sendMidiNoteOff",
      value: function sendMidiNoteOff(pitch, button) {
        // -1 is sent when releasing the sustain pedal.
        if (button === -1) button = 0; //const msg = [0x80 + button, pitch, 0x7f];    // note on, middle C, full velocity.

        var msg = [0x80, pitch, 0x7f]; // note on, middle C, full velocity.

        this.midiOut[this.selectOutElement.selectedIndex].send(msg);
      }
    }, {
      key: "getMIDIMessage",
      value: function getMIDIMessage(msg) {
        if (!this.usingMidiIn) {
          return;
        }

        var command = msg.data[0];
        var button = msg.data[1];
        var velocity = msg.data.length > 2 ? msg.data[2] : 0; // a velocity value might not be included with a noteOff command

        switch (command) {
          case 0x90:
            // note on
            buttonDown(button, false);
            break;

          case 0x80:
            // note off
            buttonUp(button);
            break;
        }
      }
    }]);

    return Player;
  }();
  /*************************
   * Floaty notes
   ************************/


  var FloatyNotes = /*#__PURE__*/function () {
    function FloatyNotes() {
      _classCallCheck(this, FloatyNotes);

      this.notes = []; // the notes floating on the screen.

      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = 4;
      this.context.lineCap = 'round';
      this.contextHeight = 0;
    }

    _createClass(FloatyNotes, [{
      key: "resize",
      value: function resize(whiteNoteHeight) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.contextHeight = window.innerHeight - whiteNoteHeight - 20;
      }
    }, {
      key: "addNote",
      value: function addNote(button, x, width) {
        var noteToPaint = {
          x: parseFloat(x),
          y: 0,
          width: parseFloat(width),
          height: 0,
          color: CONSTANTS.COLORS[button],
          on: true
        };
        this.notes.push(noteToPaint);
        return noteToPaint;
      }
    }, {
      key: "stopNote",
      value: function stopNote(noteToPaint) {
        noteToPaint.on = false;
      }
    }, {
      key: "drawLoop",
      value: function drawLoop() {
        var _this3 = this;

        var dy = 3;
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight); // Remove all the notes that will be off the page;

        this.notes = this.notes.filter(function (note) {
          return note.on || note.y < _this3.contextHeight - 100;
        }); // Advance all the notes.

        for (var i = 0; i < this.notes.length; i++) {
          var note = this.notes[i]; // If the note is still on, then its height goes up but it
          // doesn't start sliding down yet.

          if (note.on) {
            note.height += dy;
          } else {
            note.y += dy;
          }

          this.context.globalAlpha = 1 - note.y / this.contextHeight;
          this.context.fillStyle = note.color;
          this.context.fillRect(note.x, note.y, note.width, note.height);
        }

        window.requestAnimationFrame(function () {
          return _this3.drawLoop();
        });
      }
    }]);

    return FloatyNotes;
  }();

  var Piano = /*#__PURE__*/function () {
    function Piano() {
      _classCallCheck(this, Piano);

      this.config = {
        whiteNoteWidth: 20,
        blackNoteWidth: 20,
        whiteNoteHeight: 70,
        blackNoteHeight: 2 * 70 / 3
      };
      this.svg = document.getElementById('svg');
      this.svgNS = 'http://www.w3.org/2000/svg';
    }

    _createClass(Piano, [{
      key: "resize",
      value: function resize(totalWhiteNotes) {
        // i honestly don't know why some flooring is good and some is bad sigh.
        var ratio = window.innerWidth / totalWhiteNotes;
        this.config.whiteNoteWidth = OCTAVES > 6 ? ratio : Math.floor(ratio);
        this.config.blackNoteWidth = this.config.whiteNoteWidth * 2 / 3;
        this.svg.setAttribute('width', window.innerWidth);
        this.svg.setAttribute('height', this.config.whiteNoteHeight);
      }
    }, {
      key: "draw",
      value: function draw() {
        this.svg.innerHTML = '';
        var halfABlackNote = this.config.blackNoteWidth / 2;
        var x = 0;
        var y = 0;
        var index = 0;
        var blackNoteIndexes = [1, 3, 6, 8, 10]; // First draw all the white notes.
        // Pianos start on an A (if we're using all the octaves);

        if (OCTAVES > 6) {
          this.makeRect(0, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
          this.makeRect(2, this.config.whiteNoteWidth, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
          index = 3;
          x = 2 * this.config.whiteNoteWidth;
        } else {
          // Starting 3 semitones up on small screens (on a C), and a whole octave up.
          index = 3 + CONSTANTS.NOTES_PER_OCTAVE;
        } // Draw the white notes.


        for (var o = 0; o < OCTAVES; o++) {
          for (var i = 0; i < CONSTANTS.NOTES_PER_OCTAVE; i++) {
            if (blackNoteIndexes.indexOf(i) === -1) {
              this.makeRect(index, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
              x += this.config.whiteNoteWidth;
            }

            index++;
          }
        }

        if (OCTAVES > 6) {
          // And an extra C at the end (if we're using all the octaves);
          this.makeRect(index, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30'); // Now draw all the black notes, so that they sit on top.
          // Pianos start on an A:

          this.makeRect(1, this.config.whiteNoteWidth - halfABlackNote, y, this.config.blackNoteWidth, this.config.blackNoteHeight, 'black');
          index = 3;
          x = this.config.whiteNoteWidth;
        } else {
          // Starting 3 semitones up on small screens (on a C), and a whole octave up.
          index = 3 + CONSTANTS.NOTES_PER_OCTAVE;
          x = -this.config.whiteNoteWidth;
        } // Draw the black notes.


        for (var _o = 0; _o < OCTAVES; _o++) {
          for (var _i = 0; _i < CONSTANTS.NOTES_PER_OCTAVE; _i++) {
            if (blackNoteIndexes.indexOf(_i) !== -1) {
              this.makeRect(index, x + this.config.whiteNoteWidth - halfABlackNote, y, this.config.blackNoteWidth, this.config.blackNoteHeight, 'black');
            } else {
              x += this.config.whiteNoteWidth;
            }

            index++;
          }
        }
      }
    }, {
      key: "highlightNote",
      value: function highlightNote(note, button) {
        // Show the note on the piano roll.
        var rect = this.svg.querySelector("rect[data-index=\"".concat(note, "\"]"));

        if (!rect) {
          console.log('couldnt find a rect for note', note);
          return;
        }

        rect.setAttribute('active', true);
        rect.setAttribute('class', "color-".concat(button));
        return rect;
      }
    }, {
      key: "clearNote",
      value: function clearNote(rect) {
        rect.removeAttribute('active');
        rect.removeAttribute('class');
      }
    }, {
      key: "makeRect",
      value: function makeRect(index, x, y, w, h, fill, stroke) {
        var rect = document.createElementNS(this.svgNS, 'rect');
        rect.setAttribute('data-index', index);
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('fill', fill);

        if (stroke) {
          rect.setAttribute('stroke', stroke);
          rect.setAttribute('stroke-width', '3px');
        }

        this.svg.appendChild(rect);
        return rect;
      }
    }]);

    return Piano;
  }();

  function showFocusTip() {
    document.querySelector('.embed-focus-tip').classList.add('visible');
  }

  function hideFocusTip() {
    document.querySelector('.embed-focus-tip').classList.remove('visible');
  }
  /*************************
   * Consts for everyone!
   ************************/
  // button mappings.


  var MAPPING_8 = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
  };
  var MAPPING_4 = {
    0: 0,
    1: 2,
    2: 5,
    3: 7,
    4: 0,
    5: 2,
    6: 5,
    7: 7
  };
  var KEYCODES_NUMBERS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8'];
  var KEYCODES_STD = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'];
  var KEYCODES_MAKEY = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
  var OCTAVES = 7;
  var NUM_BUTTONS = options.keyCount === 4 ? 4 : 8;
  var BUTTON_MAPPING = MAPPING_8;
  var keyWhitelist;
  var TEMPERATURE = getTemperature();
  var heldButtonToVisualData = new Map(); // Which notes the pedal is sustaining.

  var sustaining = false;
  var sustainingNotes = [];
  var inputsForButtons = new Map();
  var player = new Player();
  var genie = new mm.PianoGenie(CONSTANTS.GENIE_CHECKPOINT);
  var painter = new FloatyNotes();
  var piano = new Piano();
  var isUsingMakey = false;
  initEverything();
  /*************************
   * Basic UI bits
   ************************/

  function initEverything() {
    genie.initialize().then(function () {
      console.log('🧞‍♀️ ready!'); // playBtn.textContent = 'Play';
      // playBtn.removeAttribute('disabled');
      // playBtn.classList.remove('loading');

      showMainScreen();
    }); // Start the drawing loop.

    onWindowResize();
    updateButtonText();
    window.requestAnimationFrame(function () {
      return painter.drawLoop();
    }); // Event listeners.

    document.getElementById('numButtons4').addEventListener('change', function (event) {
      return event.target.checked && updateNumButtons(4);
    });
    document.getElementById('numButtons8').addEventListener('change', function (event) {
      return event.target.checked && updateNumButtons(8);
    });
    document.getElementById('numButtons4').checked = NUM_BUTTONS === 4;
    document.getElementById('numButtons8').checked = NUM_BUTTONS !== 4;
    updateNumButtons(NUM_BUTTONS);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onWindowResize);
    window.addEventListener('hashchange', function () {
      return TEMPERATURE = getTemperature();
    });

    if (options.embedMode) {
      window.addEventListener('focus', function () {
        hideFocusTip();
      });
      window.addEventListener('blur', function () {
        showFocusTip();
      });

      if (!document.hasFocus()) {
        showFocusTip();
      }
    }
  }

  function updateNumButtons(num) {
    NUM_BUTTONS = num;
    var buttons = document.querySelectorAll('.controls > .keyboard > button.color');
    BUTTON_MAPPING = num === 4 ? MAPPING_4 : MAPPING_8; // Hide the extra buttons.

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].hidden = i >= num;
    }
  }

  function showMainScreen() {
    document.querySelector('.splash').hidden = true;
    document.querySelector('.loaded').hidden = false;
    document.addEventListener('keydown', onKeyDown);

    var noop = function noop() {};

    var filterActivePointer = function filterActivePointer(cb) {
      return function (e) {
        return e.buttons !== 0 ? cb(e) : noop();
      };
    };

    var buttons = document.querySelectorAll(".keyboard button.color");

    var _iterator = _createForOfIteratorHelper(buttons),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var button = _step.value;
        button.addEventListener('pointercancel', doPointerStart);
        button.addEventListener('pointerdown', doPointerStart);
        button.addEventListener('pointerup', doPointerEnd);
        button.addEventListener('pointerover', filterActivePointer(doPointerStart));
        button.addEventListener('pointerout', filterActivePointer(doPointerEnd));
      } // Output.

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    radioMidiOutYes.addEventListener('click', function () {
      player.usingMidiOut = true;
      midiOutBox.hidden = false;
    });
    radioAudioYes.addEventListener('click', function () {
      player.usingMidiOut = false;
      midiOutBox.hidden = true;
    });

    if (options.output === 'wave') {
      radioAudioYes.click();
    } else if (options.output === 'midi') {
      radioMidiOutYes.click();
    } // Input.


    radioMidiInYes.addEventListener('click', function () {
      player.usingMidiIn = true;
      midiInBox.hidden = false;
      isUsingMakey = false;
      updateButtonText();
    });
    radioDeviceYes.addEventListener('click', function () {
      player.usingMidiIn = false;
      midiInBox.hidden = true;
      isUsingMakey = false;
      updateButtonText();
    });
    radioMakeyYes.addEventListener('click', function () {
      player.usingMidiIn = false;
      midiInBox.hidden = true;
      isUsingMakey = true;
      updateButtonText();
    });

    if (options.input === 'keyboard') {
      radioDeviceYes.click();
    } else if (options.input === 'makey') {
      radioMakeyYes.click();
    } else if (options.input === 'midi') {
      radioMidiInYes.click();
    } // Figure out if WebMidi works.


    if (navigator.requestMIDIAccess) {
      midiNotSupported.hidden = true;
      radioMidiInYes.parentElement.removeAttribute('disabled');
      radioMidiOutYes.parentElement.removeAttribute('disabled');
      navigator.requestMIDIAccess().then(function (midi) {
        return player.midiReady(midi);
      }, function (err) {
        return console.log('Something went wrong', err);
      });
    } else {
      midiNotSupported.hidden = false;
      radioMidiInYes.parentElement.setAttribute('disabled', true);
      radioMidiOutYes.parentElement.setAttribute('disabled', true);
    }

    document.addEventListener('keyup', onKeyUp); // Slow to start up, so do a fake prediction to warm up the model.

    var note = genie.nextFromKeyWhitelist(0, keyWhitelist, TEMPERATURE);
    genie.resetState();
  }

  function preprocessPointerEvent(event) {
    event.preventDefault();
    var buttonId = event.target.dataset.id;
    var inputString = "pointer_".concat(event.pointerId);
    return {
      buttonId: buttonId,
      inputString: inputString
    };
  } // Here pointer means either touch or mouse.


  function doPointerStart(event) {
    doInputStart(preprocessPointerEvent(event));
  }

  function doPointerEnd(event) {
    doInputEnd(preprocessPointerEvent(event));
  }

  function doInputStart(_ref) {
    var buttonId = _ref.buttonId,
        inputString = _ref.inputString;

    if (!inputsForButtons.has(buttonId)) {
      inputsForButtons.set(buttonId, new Set());
    }

    var inputsForButton = inputsForButtons.get(buttonId);

    if (inputsForButton.size === 0) {
      buttonDown(buttonId);
    }

    inputsForButton.add(inputString);
  }

  function doInputEnd(_ref2) {
    var buttonId = _ref2.buttonId,
        inputString = _ref2.inputString;

    if (!inputsForButtons.has(buttonId)) {
      inputsForButtons.set(buttonId, new Set());
    }

    var inputsForButton = inputsForButtons.get(buttonId);
    inputsForButton["delete"](inputString);

    if (inputsForButton.size === 0) {
      buttonUp(buttonId);
    }
  }
  /*************************
   * Button actions
   ************************/


  function buttonDown(button) {
    // If we're already holding this button down, nothing new to do.
    if (heldButtonToVisualData.has(button)) {
      return;
    }

    var el = document.getElementById("btn".concat(button));
    if (!el) return;
    el.setAttribute('active', true);
    var note = genie.nextFromKeyWhitelist(BUTTON_MAPPING[button], keyWhitelist, TEMPERATURE);
    var pitch = CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + note; // Hear it.

    player.playNoteDown(pitch, button); // See it.

    var rect = piano.highlightNote(note, button);

    if (!rect) {
      debugger;
    } // Float it.


    var noteToPaint = painter.addNote(button, rect.getAttribute('x'), rect.getAttribute('width'));
    heldButtonToVisualData.set(button, {
      rect: rect,
      note: note,
      noteToPaint: noteToPaint
    });
  }

  function buttonUp(button) {
    var el = document.getElementById("btn".concat(button));
    if (!el) return;
    el.removeAttribute('active');
    var thing = heldButtonToVisualData.get(button);

    if (thing) {
      // Don't see it.
      piano.clearNote(thing.rect); // Stop holding it down.

      painter.stopNote(thing.noteToPaint); // Maybe stop hearing it.

      var pitch = CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + thing.note;

      if (!sustaining) {
        player.playNoteUp(pitch, button);
      } else {
        sustainingNotes.push(CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + thing.note);
      }
    }

    heldButtonToVisualData["delete"](button);
  }
  /*************************
   * Events
   ************************/


  function onKeyDown(event) {
    // Keydown fires continuously and we don't want that.
    if (event.repeat) {
      return;
    }

    if (event.key === ' ') {
      // sustain pedal
      sustaining = true;
    } else if (event.key === '0' || event.key === 'r') {
      console.log('🧞‍♀️ resetting!');
      genie.resetState();
    } else {
      var button = getButtonFromKeyCode(event.code);

      if (button != null) {
        var buttonId = "".concat(button);
        var inputString = "key_".concat(event.code);
        doInputStart({
          buttonId: buttonId,
          inputString: inputString
        });
      }
    }
  }

  function onKeyUp(event) {
    if (event.key === ' ') {
      // sustain pedal
      sustaining = false; // Release everything.

      sustainingNotes.forEach(function (note) {
        return player.playNoteUp(note, -1);
      });
      sustainingNotes = [];
    } else {
      var button = getButtonFromKeyCode(event.code);

      if (button != null) {
        var buttonId = "".concat(button);
        var inputString = "key_".concat(event.code);
        doInputEnd({
          buttonId: buttonId,
          inputString: inputString
        });
      }
    }
  }

  function onWindowResize() {
    OCTAVES = window.innerWidth > 700 ? 7 : 3;
    var bonusNotes = OCTAVES > 6 ? 4 : 0; // starts on an A, ends on a C.

    var totalNotes = CONSTANTS.NOTES_PER_OCTAVE * OCTAVES + bonusNotes;
    var totalWhiteNotes = CONSTANTS.WHITE_NOTES_PER_OCTAVE * OCTAVES + (bonusNotes - 1);
    keyWhitelist = Array(totalNotes).fill().map(function (x, i) {
      if (OCTAVES > 6) return i; // Starting 3 semitones up on small screens (on a C), and a whole octave up.

      return i + 3 + CONSTANTS.NOTES_PER_OCTAVE;
    });
    piano.resize(totalWhiteNotes);
    painter.resize(piano.config.whiteNoteHeight);
    piano.draw();
  }
  /*************************
   * Utils and helpers
   ************************/


  function getButtonFromKeyCode(code) {
    var index;

    if (isUsingMakey) {
      index = KEYCODES_MAKEY.indexOf(code);
    } else {
      index = KEYCODES_NUMBERS.indexOf(code);

      if (index === -1) {
        index = KEYCODES_STD.indexOf(code);
      }
    }

    return index !== -1 ? index : null;
  }

  function getTemperature() {
    var hash = parseFloat(parseHashParameters()['temperature']) || 0.25;
    var newTemp = Math.min(1, hash);
    console.log('🧞‍♀️ temperature = ', newTemp);
    return newTemp;
  }

  function parseHashParameters() {
    var hash = window.location.hash.substring(1);
    var params = {};
    hash.split('&').map(function (hk) {
      var temp = hk.split('=');
      params[temp[0]] = temp[1];
    });
    return params;
  }

  function updateButtonText() {
    var btns = document.querySelectorAll('.controls button.color');
    var display = IMAGINARY.i18n.t(isUsingMakey ? 'keysMakeyMakey' : 'keys').split(' ');

    for (var i = 0; i < btns.length; i += 1) {
      if (options.showInputKeysText) {
        btns[i].innerHTML = isUsingMakey ? "<span>".concat(display[i], "</span>") : "<span>".concat(i + 1, "</span><br><span>").concat(display[i], "</span>");
      }

      if (!options.showInputKeys) {
        btns[i].style.display = 'none';
      }
    }
  }

  document.querySelector('#btnInfo').addEventListener('click', function () {
    var infoBox = document.querySelector('#infoBox');
    infoBox.hidden = !infoBox.hidden;
  });

  if (!options.showInfoButton) {
    document.querySelector('#btnInfo').style.display = 'none';
  }

  if (!options.showInputInstructions) {
    document.querySelector('[data-i18n-field=INFO_INSTRUCTIONS]').style.display = 'none';
  }

  document.querySelector('#btnSettings').addEventListener('click', function () {
    var settingsBox = document.querySelector('#settingsBox');
    settingsBox.hidden = !settingsBox.hidden;
  });

  if (!options.showConfigButton) {
    document.querySelector('#btnSettings').style.display = 'none';
  }

  var body = document.querySelector('body');

  if (!body.requestFullscreen || !options.showFullScreenButton) {
    document.querySelector('#btnFullscreen').style.display = 'none';
  } else {
    document.querySelector('#btnFullscreen').addEventListener('click', function () {
      if (!document.fullscreenElement) {
        body.requestFullscreen()["catch"](function (err) {
          alert("Error attempting to enable full-screen mode: ".concat(err.message, " (").concat(err.name, ")"));
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
}

},{}],3:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var util = require('./utils');

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = util.assign(
    {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        }
    },
    Format
);

},{"./utils":7}],4:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":3,"./parse":5,"./stringify":6}],5:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj; // eslint-disable-line no-param-reassign
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":7}],6:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        }).join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key') : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key');
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value'))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly,
            charset
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":3,"./utils":7}],7:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

},{}]},{},[1])

