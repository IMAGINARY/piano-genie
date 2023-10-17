importScripts('../../vendor/tensorflow/tfjs-1.7.4/tf.min.js');
importScripts('../../vendor/magenta/music-1.23.1/core.js');
importScripts('../../vendor/magenta/music-1.23.1/piano_genie.js');

const checkpoint = '../../model/genie';

const genie = new piano_genie.PianoGenie(checkpoint);
const initPromise = genie.initialize().then(() => {
    // Slow to start up, so do a fake prediction to warm up the model.
    genie.nextFromKeyList(0, [0, 1], 0.25);
    genie.resetState();
});

async function processCommand(command, args) {
    try {
        await initPromise;

        switch (command) {
            case 'init':
                postMessage({success: true});
                break;
            case 'reset':
                genie.resetState();
                postMessage({success: true});
                break;
            case 'note':
                const {button, keyWhitelist, temperature} = args;
                const note = genie.nextFromKeyList(button, keyWhitelist, temperature);
                postMessage({success: true, result: note});
                break;
            default:
                throw new Error(`Unknown command '${command}'`);
        }
    } catch (error) {
        postMessage({success: false, result: error});
    }
}

self.onmessage = async (event) => {
    const {command, args} = event.data;
    console.log(event, command, args);
    await processCommand(command, args);
};
