import isEmail from 'validator/lib/isEmail';
import { statusConstants } from 'molecular-design-applications-shared';
import apiUtils from './api_utils';
import ioUtils from './io_utils';

const appUtils = {
  /**
   * Return a boolean indicating if the given run is runnable
   * @param {RunRecord} run
   * @returns {Boolean}
  */
  isRunnable(run) {
    if (!ioUtils.getPdb(run.inputs)) {
      return false;
    }
    if (!isEmail(run.email)) {
      return false;
    }
    if (run.status === statusConstants.RUNNING) {
      return false;
    }
    if (run.fetching) {
      return false;
    }

    return true;
  },

  /**
   * Read the given file and return a promise that resolves with its contents
   * @param file {File}
   * @returns {Promise}
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  /**
   * Using the api, go through the full step0 input processing flow
   * Calls to this should be surrounded by try/catch!
   * @param {String} appId
   * @param {String} input
   * @param {String} [extension]
   * @returns {Array}
   */
  processInput: async function processInput(appId, input, extension) {
    let inputs = await apiUtils.processInput(appId, input, extension);

    // Find the json results
    inputs = await appUtils.fetchIoResults(inputs);

    // Get the processed input pdbs
    inputs = await appUtils.fetchIoPdbs(inputs);

    // Make sure the json results are valid and also indicate a success.
    const inputErrorMessage = ioUtils.getInputError(inputs);
    if (inputErrorMessage) {
      const error = new Error(inputErrorMessage);
      error.inputs = inputs;
      throw error;
    }

    return inputs;
  },

  /**
   * Fetch the results json for any of the given ios with a json url.
   * Return new ios with fetchedResult set for the json.
   * @param ios {IList}
   * @returns {Promise that resolves with IList}
   */
  fetchIoResults(ios) {
    let newIos = ios;

    return Promise.all(ios.map((io) => {
      if (!io.value.endsWith('.json')) {
        return Promise.resolve();
      }
      return apiUtils.getIoData(io.value).then((results) => {
        // Set newIos to a new list that contains the fetched results data
        newIos = newIos.set(
          newIos.indexOf(io), io.set('fetchedValue', results),
        );
      });

    // Resolve with the new list of ios
    })).then(() => newIos);
  },

  /**
   * Fetch the pdb for any of the given ios with a pdb url.
   * Return new ios with fetchedResult set for the pdb data.
   * @param ios {IList}
   * @returns {Promise that resolves with an IList}
   */
  fetchIoPdbs(ios) {
    let newIos = ios;

    return Promise.all(ios.map((io) => {
      if (!io.value.endsWith('.pdb')) {
        return Promise.resolve();
      }
      return apiUtils.getPdb(io.value).then((results) => {
        // Set newIos to a new list that contains the fetched pdb
        newIos = newIos.set(
          newIos.indexOf(io), io.set('fetchedValue', results),
        );
      });

    // Resolve with the new list of ios
    })).then(() => newIos);
  },
};

export default appUtils;
