import {PianoGenieAsync} from "./piano-genia-async";

/* globals IMAGINARY */

export function initPianoGenie(options) {

  const CONSTANTS = {
    COLORS : ['#db4c67','#ff8459','#ffec02','#73ff6c',
      '#00c5ba','#3753be','#9c52ff','#ef71f2'],
    NUM_BUTTONS : 8,
    NOTES_PER_OCTAVE : 12,
    WHITE_NOTES_PER_OCTAVE : 7,
    LOWEST_PIANO_KEY_MIDI_NOTE : 21,
    NUM_NOTES: 88,
    GENIE_CHECKPOINT : 'model/genie',
  }

  /*************************
   * MIDI or Magenta player
   ************************/
  class Player {
    constructor() {
      this.player = new core.SoundFontPlayer('vendor/sgm_plus');
      this.midiOut = [];
      this.midiIn = []
      this.usingMidiOut = false;
      this.usingMidiIn = false;
      this.selectOutElement = document.getElementById('selectOut');
      this.selectInElement = document.getElementById('selectIn');
      this.loadAllSamples();
    }

    loadAllSamples() {
      const seq = {notes:[]};
      for (let i = 0; i < CONSTANTS.NUM_NOTES; i++) {
        seq.notes.push({pitch: CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + i});
      }
      this.player.loadSamples(seq);
    }

    playNoteDown(pitch, button) {
      // Send to MIDI out or play with the Magenta player.
      if (this.usingMidiOut) {
        this.sendMidiNoteOn(pitch, button);
      } else {
        core.Player.tone.context.resume();
        this.player.playNoteDown({pitch:pitch});
      }
    }

    playNoteUp(pitch, button) {
      // Send to MIDI out or play with the Magenta player.
      if (this.usingMidiOut) {
        this.sendMidiNoteOff(pitch, button);
      } else {
        this.player.playNoteUp({pitch:pitch});
      }
    }

    // MIDI bits.
    midiReady(midi) {
      // Also react to device changes.
      midi.addEventListener('statechange', (event) => this.initDevices(event.target));
      this.initDevices(midi);
    }

    initDevices(midi) {
      this.midiOut = [];
      this.midiIn = [];


      const outputs = midi.outputs.values();
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        this.midiOut.push(output.value);
      }

      const inputs = midi.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        this.midiIn.push(input.value);
        // TODO: should probably use the selected index from this.selectInElement for correctness
        // but i'm hacking this together for a demo so...
        input.value.onmidimessage = (msg) => this.getMIDIMessage(msg);

      }

      // No MIDI, no settings.
      //btnSettings.hidden = (this.midiOut.length === 0 && this.midiIn.length === 0);
      this.selectInElement.innerHTML = this.midiIn.map(device => `<option>${device.name}</option>`).join('');
      this.selectOutElement.innerHTML = this.midiOut.map(device => `<option>${device.name}</option>`).join('');
    }

    sendMidiNoteOn(pitch, button) {
      // -1 is sent when releasing the sustain pedal.
      if (button === -1) button = 0;
      //const msg = [0x90 + button, pitch, 0x7f];    // note on, full velocity.
      const msg = [0x90, pitch, 0x7f];    // note on, full velocity.
      this.midiOut[this.selectOutElement.selectedIndex].send(msg);
    }

    sendMidiNoteOff(pitch, button) {
      // -1 is sent when releasing the sustain pedal.
      if (button === -1) button = 0;
      //const msg = [0x80 + button, pitch, 0x7f];    // note on, middle C, full velocity.
      const msg = [0x80, pitch, 0x7f];    // note on, middle C, full velocity.
      this.midiOut[this.selectOutElement.selectedIndex].send(msg);
    }

    getMIDIMessage(msg) {
      if (!this.usingMidiIn) {
        return;
      }
      const command = msg.data[0];
      const button = msg.data[1];
      const velocity = (msg.data.length > 2) ? msg.data[2] : 0; // a velocity value might not be included with a noteOff command

      switch (command) {
        case 0x90: // note on
          buttonDown(button, false);
          break;
        case 0x80: // note off
          buttonUp(button);
          break;
      }
    }
  }

  /*************************
   * Floaty notes
   ************************/
  class FloatyNotes {
    constructor() {
      this.notes = [];  // the notes floating on the screen.

      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d');
      this.context.lineWidth = 4;
      this.context.lineCap = 'round';

      this.contextHeight = 0;
    }

    resize(whiteNoteHeight) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = this.contextHeight = window.innerHeight - whiteNoteHeight - 20;
    }

    addNote(button, x, width) {
      const noteToPaint = {
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

    stopNote(noteToPaint) {
      noteToPaint.on = false;
    }

    drawLoop() {
      const dy = 3;
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Remove all the notes that will be off the page;
      this.notes = this.notes.filter((note) => note.on || note.y < (this.contextHeight - 100));

      // Advance all the notes.
      for (let i = 0; i < this.notes.length; i++) {
        const note = this.notes[i];

        // If the note is still on, then its height goes up but it
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
      window.requestAnimationFrame(() => this.drawLoop());
    }
  }

  class Piano {
    constructor() {
      this.config = {
        whiteNoteWidth: 20,
        blackNoteWidth: 20,
        whiteNoteHeight: 70,
        blackNoteHeight: 2 * 70 / 3
      }

      this.svg = document.getElementById('svg');
      this.svgNS = 'http://www.w3.org/2000/svg';
    }

    resize(totalWhiteNotes) {
      // i honestly don't know why some flooring is good and some is bad sigh.
      const ratio = window.innerWidth / totalWhiteNotes;
      this.config.whiteNoteWidth = OCTAVES > 6 ? ratio: Math.floor(ratio);
      this.config.blackNoteWidth = this.config.whiteNoteWidth * 2 / 3;
      this.svg.setAttribute('width', window.innerWidth);
      this.svg.setAttribute('height', this.config.whiteNoteHeight);
    }

    draw() {
      this.svg.innerHTML = '';
      const halfABlackNote = this.config.blackNoteWidth / 2;
      let x = 0;
      let y = 0;
      let index = 0;

      const blackNoteIndexes = [1, 3, 6, 8, 10];

      // First draw all the white notes.
      // Pianos start on an A (if we're using all the octaves);
      if (OCTAVES > 6) {
        this.makeRect(0, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
        this.makeRect(2, this.config.whiteNoteWidth, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
        index = 3;
        x = 2 * this.config.whiteNoteWidth;
      } else {
        // Starting 3 semitones up on small screens (on a C), and a whole octave up.
        index = 3 + CONSTANTS.NOTES_PER_OCTAVE;
      }

      // Draw the white notes.
      for (let o = 0; o < OCTAVES; o++) {
        for (let i = 0; i < CONSTANTS.NOTES_PER_OCTAVE; i++) {
          if (blackNoteIndexes.indexOf(i) === -1) {
            this.makeRect(index, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');
            x += this.config.whiteNoteWidth;
          }
          index++;
        }
      }

      if (OCTAVES > 6) {
        // And an extra C at the end (if we're using all the octaves);
        this.makeRect(index, x, y, this.config.whiteNoteWidth, this.config.whiteNoteHeight, 'white', '#141E30');

        // Now draw all the black notes, so that they sit on top.
        // Pianos start on an A:
        this.makeRect(1, this.config.whiteNoteWidth - halfABlackNote, y, this.config.blackNoteWidth, this.config.blackNoteHeight, 'black');
        index = 3;
        x = this.config.whiteNoteWidth;
      } else {
        // Starting 3 semitones up on small screens (on a C), and a whole octave up.
        index = 3 + CONSTANTS.NOTES_PER_OCTAVE;
        x = -this.config.whiteNoteWidth;
      }

      // Draw the black notes.
      for (let o = 0; o < OCTAVES; o++) {
        for (let i = 0; i < CONSTANTS.NOTES_PER_OCTAVE; i++) {
          if (blackNoteIndexes.indexOf(i) !== -1) {
            this.makeRect(index, x + this.config.whiteNoteWidth - halfABlackNote, y, this.config.blackNoteWidth, this.config.blackNoteHeight, 'black');
          } else {
            x += this.config.whiteNoteWidth;
          }
          index++;
        }
      }
    }

    highlightNote(note, button) {
      // Show the note on the piano roll.
      const rect = this.svg.querySelector(`rect[data-index="${note}"]`);
      if (!rect) {
        console.log('couldnt find a rect for note', note);
        return;
      }
      rect.setAttribute('active', true);
      rect.setAttribute('class', `color-${button}`);
      return rect;
    }

    clearNote(rect) {
      rect.removeAttribute('active');
      rect.removeAttribute('class');
    }

    makeRect(index, x, y, w, h, fill, stroke) {
      const rect = document.createElementNS(this.svgNS, 'rect');
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
  }

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
  const MAPPING_8 = {0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7};
  const MAPPING_4 = {0:0, 1:2, 2:5, 3:7, 4:0, 5:2, 6:5, 7:7};
  const KEYCODES_NUMBERS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8'];
  const KEYCODES_STD = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'];
  const KEYCODES_MAKEY = ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];

  let OCTAVES = 7;
  let NUM_BUTTONS = options.keyCount === 4 ? 4 : 8;
  let BUTTON_MAPPING = MAPPING_8;

  let keyWhitelist;
  let TEMPERATURE = getTemperature();

  const heldButtonToVisualData = new Map();

// Which notes the pedal is sustaining.
  let sustaining = false
  let sustainingNotes = [];

  const inputsForButtons = new Map();

  const player = new Player();
  const genie = new PianoGenieAsync(CONSTANTS.GENIE_CHECKPOINT);
  const painter = new FloatyNotes();
  const piano = new Piano();
  let isUsingMakey = false;
  initEverything();

  /*************************
   * Basic UI bits
   ************************/
  function initEverything() {
    genie.initialize().then(() => {
      console.log('🧞‍♀️ ready!');
      // playBtn.textContent = 'Play';
      // playBtn.removeAttribute('disabled');
      // playBtn.classList.remove('loading');
      showMainScreen();
    });

    // Start the drawing loop.
    onWindowResize();
    updateButtonText();
    window.requestAnimationFrame(() => painter.drawLoop());

    // Event listeners.
    document.getElementById('numButtons4').addEventListener('change', (event) => event.target.checked && updateNumButtons(4));
    document.getElementById('numButtons8').addEventListener('change', (event) => event.target.checked && updateNumButtons(8));
    document.getElementById('numButtons4').checked = (NUM_BUTTONS === 4);
    document.getElementById('numButtons8').checked = (NUM_BUTTONS !== 4);
    updateNumButtons(NUM_BUTTONS);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onWindowResize);
    window.addEventListener('hashchange', () => TEMPERATURE = getTemperature());

    if(options.embedMode) {
      window.addEventListener('focus', () => { hideFocusTip(); });
      window.addEventListener('blur', () => { showFocusTip(); });
      if (!document.hasFocus()) {
        showFocusTip();
      }
    }
  }

  function updateNumButtons(num) {
    NUM_BUTTONS = num;
    const buttons = document.querySelectorAll('.controls > .keyboard > button.color');
    BUTTON_MAPPING = (num === 4) ? MAPPING_4 : MAPPING_8;

    // Hide the extra buttons.
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].hidden = i >= num;
    }
  }

  function showMainScreen() {
    document.querySelector('.splash').hidden = true;
    document.querySelector('.loaded').hidden = false;

    document.addEventListener('keydown',onKeyDown);

    const eventListenerOptions = {passive: false};
    const preventDefault = (e) => e.preventDefault();

    // Prevent the context menu where possible.
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('contextmenu', preventDefault, eventListenerOptions);
    window.addEventListener('contextmenu', preventDefault, eventListenerOptions);

    // Allow the user to press anywhere to start, not just on the buttons.
    // (Implicit pointer capture on touch devices would prevent this.)
    window.addEventListener('pointerdown', (e) => e.target.releasePointerCapture(e.pointerId));

    // Clean up pointers that don't end on the button bar.
    const releasePointer = (event) => {
      const inputString = `pointer_${event.pointerId}`;
      for( let i = 0; i < NUM_BUTTONS; i+= 1) {
        doInputEnd({buttonId: `${i}`, inputString});
      }
    }
    window.addEventListener('pointercancel', releasePointer, eventListenerOptions);
    window.addEventListener('pointerup', releasePointer, eventListenerOptions);

    const releasePointerCapture = (event) => {
      event.target.releasePointerCapture(event.pointerId);
      event.currentTarget.releasePointerCapture(event.pointerId);
    };
    const noop = () => {};
    const ignoreHover = (cb) => e => e.buttons !== 0 ? cb(e) : noop();
    const buttons = document.querySelectorAll(".keyboard button.color");
    for(const button of buttons) {
      // Prevent accidental section of elements and texts.
      button.addEventListener('pointerdown', preventDefault, eventListenerOptions);

      // Browsers that support direct manipulation (e.g. most browser on mobile devices)
      // trigger implicit pointer capture on a `pointerdown` event. This prevents
      // `pointerover` and `pointerout` from firing, so we need to manually release the
      // pointer capture on `pointerdown`.
      button.addEventListener('pointerdown', releasePointerCapture, eventListenerOptions);

      // Manage pointer lifecycle for each button.
      button.addEventListener('pointercancel', releasePointer, eventListenerOptions);
      button.addEventListener('pointerdown', doPointerStart, eventListenerOptions);
      button.addEventListener('pointerup', releasePointer, eventListenerOptions);
      button.addEventListener('pointerover', ignoreHover(doPointerStart), eventListenerOptions);
      button.addEventListener('pointerout', doPointerEnd, eventListenerOptions);
    }

    // Output.
    radioMidiOutYes.addEventListener('click', () => {
      player.usingMidiOut = true;
      midiOutBox.hidden = false;
    });
    radioAudioYes.addEventListener('click', () => {
      player.usingMidiOut = false;
      midiOutBox.hidden = true;
    });

    if (options.output === 'wave') {
      radioAudioYes.click();
    } else if (options.output === 'midi') {
      radioMidiOutYes.click();
    }

    // Input.
    radioMidiInYes.addEventListener('click', () => {
      player.usingMidiIn = true;
      midiInBox.hidden = false;
      isUsingMakey = false;
      updateButtonText();
    });
    radioDeviceYes.addEventListener('click', () => {
      player.usingMidiIn = false;
      midiInBox.hidden = true;
      isUsingMakey = false;
      updateButtonText();
    });
    radioMakeyYes.addEventListener('click', () => {
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
    }

    // Figure out if WebMidi works.
    if (navigator.requestMIDIAccess) {
      midiNotSupported.hidden = true;
      radioMidiInYes.parentElement.removeAttribute('disabled');
      radioMidiOutYes.parentElement.removeAttribute('disabled');
      navigator.requestMIDIAccess()
        .then(
          (midi) => player.midiReady(midi),
          (err) => console.log('Something went wrong', err));
    } else {
      midiNotSupported.hidden = false;
      radioMidiInYes.parentElement.setAttribute('disabled', true);
      radioMidiOutYes.parentElement.setAttribute('disabled', true);
    }

    document.addEventListener('keyup', onKeyUp);

    // Slow to start up, so do a fake prediction to warm up the model.
    const note = genie.nextFromKeyWhitelist(0, keyWhitelist, TEMPERATURE);
    genie.resetState();
  }

  function preprocessPointerEvent(event) {
    // We want the element to which the event handler has been attached,
    // so we use `currentTarget` instead of `target`.
    const buttonId = event.currentTarget.dataset.id;
    const inputString = `pointer_${event.pointerId}`;
    return {buttonId, inputString};
  }

  // Here pointer means either touch or mouse.
  function doPointerStart(event) {
    doInputStart(preprocessPointerEvent(event));
  }
  function doPointerEnd(event) {
    doInputEnd(preprocessPointerEvent(event));
  }

  function doInputStart({buttonId, inputString}) {
    if(!inputsForButtons.has(buttonId)) {
      inputsForButtons.set(buttonId, new Set());
    }
    const inputsForButton = inputsForButtons.get(buttonId);
    if(inputsForButton.size === 0) {
      buttonDown(buttonId);
    }
    inputsForButton.add(inputString);
  }

  function doInputEnd({buttonId, inputString}) {
    if(!inputsForButtons.has(buttonId)) {
      inputsForButtons.set(buttonId, new Set());
    }
    const inputsForButton = inputsForButtons.get(buttonId);
    const wasHolding = inputsForButton.has(inputString);
    inputsForButton.delete(inputString)
    // Only release button if it hasn't already been released before.
    if(wasHolding && inputsForButton.size === 0) {
      buttonUp(buttonId);
    }
  }

  /*************************
   * Button actions
   ************************/
  async function buttonDown(button) {
    // If we're already holding this button down, nothing new to do.
    if (heldButtonToVisualData.has(button)) {
      return;
    }

    const el = document.getElementById(`btn${button}`);
    if (!el)
      return;
    el.setAttribute('active', true);

    const note = await genie.nextFromKeyListAsync(BUTTON_MAPPING[button], keyWhitelist, TEMPERATURE);
    const pitch = CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + note;

    // Hear it.
    player.playNoteDown(pitch, button);

    // See it.
    const rect = piano.highlightNote(note, button);

    if (!rect) {
      debugger;
    }
    // Float it.
    const noteToPaint = painter.addNote(button, rect.getAttribute('x'), rect.getAttribute('width'));
    heldButtonToVisualData.set(button, {rect:rect, note:note, noteToPaint:noteToPaint});
  }

  function buttonUp(button) {
    const el = document.getElementById(`btn${button}`);
    if (!el)
      return;
    el.removeAttribute('active');

    const thing = heldButtonToVisualData.get(button);
    if (thing) {
      // Don't see it.
      piano.clearNote(thing.rect);

      // Stop holding it down.
      painter.stopNote(thing.noteToPaint);

      // Maybe stop hearing it.
      const pitch = CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + thing.note;
      if (!sustaining) {
        player.playNoteUp(pitch, button);
      } else {
        sustainingNotes.push(CONSTANTS.LOWEST_PIANO_KEY_MIDI_NOTE + thing.note);
      }
    }
    heldButtonToVisualData.delete(button);
  }

  /*************************
   * Events
   ************************/
  function onKeyDown(event) {
    // Keydown fires continuously and we don't want that.
    if (event.repeat) {
      return;
    }
    if (event.key === ' ') {  // sustain pedal
      sustaining = true;
    } else if (event.key === '0' || event.key === 'r') {
      console.log('🧞‍♀️ resetting!');
      genie.resetState();
    } else {
      const button = getButtonFromKeyCode(event.code);
      if (button != null) {
        const buttonId = `${button}`;
        const inputString = `key_${event.code}`;
        doInputStart({buttonId, inputString});
      }
    }
  }

  function onKeyUp(event) {
    if (event.key === ' ') {  // sustain pedal
      sustaining = false;

      // Release everything.
      sustainingNotes.forEach((note) => player.playNoteUp(note, -1));
      sustainingNotes = [];
    } else {
      const button = getButtonFromKeyCode(event.code);
      if (button != null) {
        const buttonId = `${button}`;
        const inputString = `key_${event.code}`;
        doInputEnd({buttonId, inputString});
      }
    }
  }

  function onWindowResize() {
    OCTAVES = window.innerWidth > 700 ? 7 : 3;
    const bonusNotes = OCTAVES > 6 ? 4 : 0;  // starts on an A, ends on a C.
    const totalNotes = CONSTANTS.NOTES_PER_OCTAVE * OCTAVES + bonusNotes;
    const totalWhiteNotes = CONSTANTS.WHITE_NOTES_PER_OCTAVE * OCTAVES + (bonusNotes - 1);
    keyWhitelist = Array(totalNotes).fill().map((x,i) => {
      if (OCTAVES > 6) return i;
      // Starting 3 semitones up on small screens (on a C), and a whole octave up.
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
    let index;
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
    const hash = parseFloat(parseHashParameters()['temperature']) || 0.25;
    const newTemp = Math.min(1, hash);
    console.log('🧞‍♀️ temperature = ', newTemp);
    return newTemp;
  }

  function parseHashParameters() {
    const hash = window.location.hash.substring(1);
    const params = {}
    hash.split('&').map(hk => {
      let temp = hk.split('=');
      params[temp[0]] = temp[1]
    });
    return params;
  }

  function updateButtonText() {
    const btns = document.querySelectorAll('.controls button.color');
    const display = IMAGINARY.i18n.t(isUsingMakey ? 'keysMakeyMakey' : 'keys').split(' ');
    for (let i = 0; i < btns.length; i += 1) {
      if (options.showInputKeysText) {
        btns[i].innerHTML = isUsingMakey
          ? `<span>${display[i]}</span>`
          : `<span>${i + 1}</span><br><span>${display[i]}</span>`;
      }

      if (!options.showInputKeys) {
        btns[i].style.display = 'none';
      }
    }
  }

  document.querySelector('#btnInfo').addEventListener('click', () => {
    const infoBox = document.querySelector('#infoBox');
    infoBox.hidden = !infoBox.hidden;
  });

  if (!options.showInfoButton) {
    document.querySelector('#btnInfo').style.display = 'none';
  }

  if (!options.showInputInstructions) {
    document.querySelector('[data-i18n-field=INFO_INSTRUCTIONS]').style.display = 'none';
  }

  document.querySelector('#btnSettings').addEventListener('click', () => {
    const settingsBox = document.querySelector('#settingsBox');
    settingsBox.hidden = !settingsBox.hidden;
  });

  if (!options.showConfigButton) {
    document.querySelector('#btnSettings').style.display = 'none';
  }

  const body = document.querySelector('body');
  if (!body.requestFullscreen || !options.showFullScreenButton) {
    document.querySelector('#btnFullscreen').style.display = 'none';
  } else {
    document.querySelector('#btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        body.requestFullscreen().catch((err) => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
}
