import keyMirror from 'keymirror';

const actionConstants = keyMirror({
  CHANGE_LIGAND_SELECTION: null,
  CHANGE_MORPH: null,
  CLICK_ABOUT: null,
  CLICK_CANCEL: null,
  CLICK_COLORIZE: null,
  CLICK_RUN: null,
  CLICK_WIDGET: null,
  FETCHED_APP: null,
  FETCHED_RUN: null,
  FETCHED_RUN_IO: null,
  GET_PDB: null,
  INPUT_FILE: null,
  INPUT_FILE_COMPLETE: null,
  INITIALIZE: null,
  INITIALIZE_APP: null,
  MESSAGE_TIMEOUT: null,
  PROCESSED_INPUT_STRING: null,
  RUN_SUBMITTED: null,
  SUBMIT_INPUT_STRING: null,
  SUBMIT_EMAIL: null,
  SUBMITTED_CANCEL: null,
});

export default actionConstants;
