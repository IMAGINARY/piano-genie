/* globals IMAGINARY */
import { initPianoGenie } from './piano-genie';

const defaultConfig = {
  defaultLanguage: 'en',
};

/**
 * Loads the config file from an external JSON file
 *
 * @param {String} uri
 * @return {Promise<any>}
 */
async function loadConfig(uri) {
  const response = await fetch(uri);
  if (response.status >= 200 && response.status < 300) {
    try {
      return await response.json();
    } catch (e) {
      throw new Error(`Error parsing config file: ${e.message}`);
    }
  }
  throw new Error(`Server returned status ${response.status} (${response.statusText}) loading config file.`);
}

/**
 * Load config files and start the program
 */
(async function main() {
  try {
    const config = Object.assign({}, defaultConfig, await loadConfig('./config.json'));
    await IMAGINARY.i18n.init({
      queryStringVariable: 'lang',
      translationsDirectory: 'tr',
      defaultLanguage: config.defaultLanguage || 'en',
    });
    initPianoGenie();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}());