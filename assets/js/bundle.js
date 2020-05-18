(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _pianoGenie = require("./piano-genie");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var defaultConfig = {
  defaultLanguage: 'en'
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
            return fetch(uri);

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
            throw new Error("Server returned status ".concat(response.status, " (").concat(response.statusText, ") loading config file."));

          case 14:
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
    var config;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.t0 = Object;
            _context.t1 = {};
            _context.t2 = defaultConfig;
            _context.next = 6;
            return loadConfig('./config.json');

          case 6:
            _context.t3 = _context.sent;
            config = _context.t0.assign.call(_context.t0, _context.t1, _context.t2, _context.t3);
            _context.next = 10;
            return IMAGINARY.i18n.init({
              queryStringVariable: 'lang',
              translationsDirectory: 'tr',
              defaultLanguage: config.defaultLanguage || 'en'
            });

          case 10:
            (0, _pianoGenie.initPianoGenie)();
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t4 = _context["catch"](0);
            // eslint-disable-next-line no-console
            console.error(_context.t4);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  function main() {
    return _main.apply(this, arguments);
  }

  return main;
})()();

},{"./piano-genie":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPianoGenie = initPianoGenie;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* globals IMAGINARY */
function initPianoGenie() {
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
  var NUM_BUTTONS = 8;
  var BUTTON_MAPPING = MAPPING_8;
  var keyWhitelist;
  var TEMPERATURE = getTemperature();
  var heldButtonToVisualData = new Map(); // Which notes the pedal is sustaining.

  var sustaining = false;
  var sustainingNotes = []; // Mousedown/up events are weird because you can mouse down in one element and mouse up
  // in another, so you're going to lose that original element and never mouse it up.

  var mouseDownButton = null;
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
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onWindowResize);
    window.addEventListener('hashchange', function () {
      return TEMPERATURE = getTemperature();
    });
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
    controls.addEventListener('touchstart', function (event) {
      return doTouchStart(event);
    }, {
      passive: true
    });
    controls.addEventListener('touchend', function (event) {
      return doTouchEnd(event);
    }, {
      passive: true
    });
    var hasTouchEvents = ('ontouchstart' in window);

    if (!hasTouchEvents) {
      controls.addEventListener('mousedown', function (event) {
        return doTouchStart(event);
      });
      controls.addEventListener('mouseup', function (event) {
        return doTouchEnd(event);
      });
    }

    controls.addEventListener('mouseover', function (event) {
      return doTouchMove(event, true);
    });
    controls.addEventListener('mouseout', function (event) {
      return doTouchMove(event, false);
    });
    controls.addEventListener('touchenter', function (event) {
      return doTouchMove(event, true);
    });
    controls.addEventListener('touchleave', function (event) {
      return doTouchMove(event, false);
    });
    canvas.addEventListener('mouseenter', function () {
      return mouseDownButton = null;
    }); // Output.

    radioMidiOutYes.addEventListener('click', function () {
      player.usingMidiOut = true;
      midiOutBox.hidden = false;
    });
    radioAudioYes.addEventListener('click', function () {
      player.usingMidiOut = false;
      midiOutBox.hidden = true;
    }); // Input.

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
    }); // Figure out if WebMidi works.

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
  } // Here touch means either touch or mouse.


  function doTouchStart(event) {
    event.preventDefault();
    mouseDownButton = event.target;
    buttonDown(event.target.dataset.id, true);
  }

  function doTouchEnd(event) {
    event.preventDefault();

    if (mouseDownButton && mouseDownButton !== event.target) {
      buttonUp(mouseDownButton.dataset.id);
    }

    mouseDownButton = null;
    buttonUp(event.target.dataset.id);
  }

  function doTouchMove(event, down) {
    // If we're already holding a button down, start holding this one too.
    if (!mouseDownButton) return;
    if (down) buttonDown(event.target.dataset.id, true);else buttonUp(event.target.dataset.id, true);
  }
  /*************************
   * Button actions
   ************************/


  function buttonDown(button, fromKeyDown) {
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
        buttonDown(button, true);
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
        buttonUp(button);
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

    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = isUsingMakey ? "<span>".concat(display[i], "</span>") : "<span>".concat(i + 1, "</span><br><span>").concat(display[i], "</span>");
    }
  }

  document.querySelector('#btnSettings').addEventListener('click', function () {
    var settingsBox = document.querySelector('#settingsBox');
    settingsBox.hidden = !settingsBox.hidden;
  });
  var body = document.querySelector('body');

  if (!body.requestFullscreen) {
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

;

},{}]},{},[1])

