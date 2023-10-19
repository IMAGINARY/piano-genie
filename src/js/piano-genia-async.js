const {logging} = core;

/**
 * Constants.
 */
const RNN_NLAYERS = 2;
const NUM_PIANOKEYS = 88;


/**
 * Frees LSTM state from GPU memory.
 *
 * @param state: The LSTM state to free.
 */
function disposeState(state) {
    for (let i = 0; i < RNN_NLAYERS; ++i) {
        state.c[i].dispose();
        state.h[i].dispose();
    }
}

/**
 * Samples logits with temperature.
 *
 * @param logits The unnormalized logits to sample from.
 * @param temperature Temperature. From 0 to 1, goes from argmax to random.
 * @param seed Random seed.
 */
function sampleLogits(
    logits,
    temperature,
    seed) {
    temperature = temperature !== undefined ? temperature : 1.;
    if (temperature < 0. || temperature > 1.) {
        throw new Error('Invalid temperature specified');
    }

    let result;

    if (temperature === 0) {
        result = tf.argMax(logits, 0);
    } else {
        if (temperature < 1) {
            logits = tf.div(logits, tf.scalar(temperature, 'float32'));
        }
        const scores = tf.reshape(tf.softmax(logits, 0), [1, -1]);
        const sample = tf.multinomial(scores, 1, seed, true);
        result = tf.reshape(sample, []);
    }

    return result;
}

export class PianoGenieAsync extends piano_genie.PianoGenie {
    constructor(url) {
        super(url);
    }

    /**
     * Given a button number with optional sampling temperature and seed,
     * evaluates Piano Genie to produce a piano key note {0, 1, ... 87}. This is
     * the simplest access point for Piano Genie, designed to be called by your
     * application in real time (it keeps track of time internally).
     *
     * @param button Button number (one of {0, 1, 2, 3, 4, 5, 6, 7}).
     * @param temperature Temperature. From 0 to 1, goes from argmax to random.
     * @param seed Random seed. Use a fixed number to get reproducible output.
     */
    next(button, temperature, seed) {
        const sampleFunc = (logits) => {
            return sampleLogits(logits, temperature, seed);
        };
        return this.nextWithCustomSamplingFunction(button, sampleFunc);
    }

    /**
     * Given a button number and a list of piano keys, evaluates Piano Genie
     * to produce a piano key note {0, 1, ..., 87}. Use this if you would like to
     * restrict Piano Genie's outputs to a subset of the keys (e.g. a particular
     * scale or range of the piano). For example, if you wanted to restrict Piano
     * Genie's outputs to be C major from middle C to one octave above, you would
     * pass [39, 41, 43, 44, 46, 48, 50, 51] as the list.
     *
     * @param button Button number (one of {0, 1, 2, 3, 4, 5, 6, 7}).
     * @param keyList Subset of keys restricting possible note outputs.
     * @param temperature Temperature. From 0 to 1, goes from argmax to random.
     * @param seed Random seed. Use a fixed number to get reproducible output.
     */
    nextFromKeyList(
        button,
        keyList,
        temperature,
        seed) {
        const sampleFunc = (logits) => {
            const keySubsetTensor = tf.tensor1d(keyList, 'int32');
            // Discard logits outside of the allowed list.
            logits = tf.gather(logits, keySubsetTensor);
            // Sample from allowed logits.
            let result = sampleLogits(logits, temperature, seed);
            // Map the subsampled logit ID back to the appropriate piano key.
            const result1d = tf.gather(keySubsetTensor, tf.reshape(result, [1]));
            result = tf.reshape(result1d, []);
            return result;
        };
        return this.nextWithCustomSamplingFunction(button, sampleFunc);
    }

    /**
     * @deprecated
     * Alias for nextFromKeyList() to maintain backwards compatibility.
     */
    nextFromKeyWhitelist(button,
                         keyList,
                         temperature,
                         seed) {
        logging.log(
            'nextFromKeyWhitelist() is deprecated, and will be removed in a future \
             version. Please use nextFromKeyList() instead',
            'PianoGenie', logging.Level.WARN);

        return this.nextFromKeyList(button, keyList, temperature, seed);
    }
    /**
     * Given a button number, evaluates Piano Genie to produce unnormalized logits
     * then samples from these logits with a custom function. Use this if you
     * want to define custom sampling behavior (e.g. a neural cache).
     *
     * @param button Button number (one of {0, 1, 2, 3, 4, 5, 6, 7}).
     * @param sampleFunc Sampling function mapping unweighted model logits
     * (tf.Tensor1D of size 88) to an integer (tf.Scalar) representing one of
     * them (e.g. 60).
     */
    nextWithCustomSamplingFunction(
        button,
        sampleFunc) {
        const lastState = this.lastState;
        this.button = button;

        const rnnInput = this.getRnnInputFeats();
        const [state, output] = this.evaluateModelAndSample(
            rnnInput, lastState, sampleFunc);
        rnnInput.dispose();

        disposeState(this.lastState);
        this.lastState = state;

        return output;
    }

    /**
     * Given an LSTM input, evaluates Piano Genie producing a piano key number.
     * Does not update state.
     *
     * @param rnnInput1d The LSTM input feature vector.
     * @param initialState The LSTM state at the previous timestep.
     * @param sampleFunc Sampling function mapping unweighted model logits
     * (tf.Tensor1D of size 88) to an integer (tf.Scalar) representing one of
     * them (e.g. 60).
     */
    evaluateModelAndSample(
        rnnInput1d,
        initialState,
        sampleFunc) {
        // TODO(chrisdonahue): Make this function asynchronous.
        // This function is (currently) synchronous, blocking other execution
        // to provide mutual exclusion. This is a workaround for race conditions
        // where the LSTM state is not updated from the current call before it is
        // needed in subsequent calls. More research is required to figure out an
        // adequate asynchronous solution.

        // Ensure that the model is initialized.
        if (!this.initialized) {
            // This should be an error in real-time context because the model isn't
            // ready to be evaluated.
            throw new Error('Model is not initialized.');
        }

        // Compute logits and sample.
        const [finalState, output] = tf.tidy(() => {
            // Project feats array through RNN input matrix.
            let rnnInput = tf.matMul(
                tf.expandDims(rnnInput1d, 0),
                this.modelVars[
                    'phero_model/decoder/rnn_input/dense/kernel']);
            rnnInput = tf.add(
                rnnInput,
                this.modelVars[
                    'phero_model/decoder/rnn_input/dense/bias']);

            // Evaluate RNN.
            const [c, h] = tf.multiRNNCell(
                this.decLSTMCells, rnnInput, initialState.c, initialState.h);
            const finalState = { c, h };

            // Project to logits.
            let logits = tf.matMul(
                h[RNN_NLAYERS - 1],
                this.modelVars[
                    'phero_model/decoder/pitches/dense/kernel']);
            logits = tf.add(
                logits,
                this.modelVars[
                    'phero_model/decoder/pitches/dense/bias']);

            // Remove batch axis to produce piano key (n=88) logits.
            const logits1D = tf.reshape(logits, [NUM_PIANOKEYS]);

            // Sample from logits.
            const sample = sampleFunc(logits1D);
            const output = sample.dataSync()[0];

            return [finalState, output];
        });

        return [finalState, output];
    }
}
