import { browserHistory } from 'react-router';
import actionConstants from './constants/action_constants';
import apiUtils from './utils/api_utils';
import workflowUtils from './utils/workflow_utils';

export function initializeWorkflow(workflowId) {
  return async function initializeWorkflowDispatch(dispatch) {
    dispatch({
      type: actionConstants.INITIALIZE_WORKFLOW,
      workflowId,
    });

    let workflow;
    try {
      workflow = await apiUtils.getWorkflow(workflowId);
    } catch (error) {
      return dispatch({
        type: actionConstants.FETCHED_WORKFLOW,
        error,
      });
    }

    return dispatch({
      type: actionConstants.FETCHED_WORKFLOW,
      workflow,
    });
  };
}

export function initializeRun(workflowId, runId) {
  return async function initializeRunDispatch(dispatch) {
    dispatch({
      type: actionConstants.INITIALIZE_WORKFLOW,
      runId,
      workflowId,
    });

    let workflow;
    try {
      workflow = await apiUtils.getRun(runId);
    } catch (error) {
      return dispatch({
        type: actionConstants.FETCHED_RUN,
        error,
      });
    }

    dispatch({
      type: actionConstants.FETCHED_RUN,
      workflow,
    });

    if (workflow.run.inputPdbUrl) {
      apiUtils.getPDB(workflow.run.inputPdbUrl).then(modelData =>
        dispatch({
          type: actionConstants.FETCHED_INPUT_PDB,
          modelData,
        })
      ).catch(error =>
        dispatch({
          type: actionConstants.FETCHED_INPUT_PDB,
          err: error,
        })
      );
    }

    if (workflow.run.outputPdbUrl) {
      apiUtils.getPDB(workflow.run.outputPdbUrl).then(modelData =>
        dispatch({
          type: actionConstants.FETCHED_OUTPUT_PDB,
          modelData,
        })
      ).catch(error =>
        dispatch({
          type: actionConstants.FETCHED_OUTPUT_PDB,
          err: error,
        })
      );
    }

    return true;
  };
}

export function clickNode(nodeId) {
  return {
    type: actionConstants.CLICK_NODE,
    nodeId,
  };
}

// TODO this is unused now that we don't show workflow nodes, but in future?
export function clickWorkflowNode(workflowNodeId) {
  return {
    type: actionConstants.CLICK_WORKFLOW_NODE,
    workflowNodeId,
  };
}

export function clickWorkflowNodeLigandSelection() {
  return {
    type: actionConstants.CLICK_WORKFLOW_NODE_LIGAND_SELECTION,
  };
}

export function clickWorkflowNodeLoad() {
  return {
    type: actionConstants.CLICK_WORKFLOW_NODE_LOAD,
  };
}

export function clickWorkflowNodeEmail() {
  return {
    type: actionConstants.CLICK_WORKFLOW_NODE_EMAIL,
  };
}

export function clickWorkflowNodeResults() {
  return {
    type: actionConstants.CLICK_WORKFLOW_NODE_RESULTS,
  };
}

export function clickRun(workflowId, email, inputPdbUrl) {
  return (dispatch) => {
    dispatch({
      type: actionConstants.CLICK_RUN,
    });

    apiUtils.run(workflowId, email, inputPdbUrl).then((runId) => {
      dispatch({
        type: actionConstants.RUN_SUBMITTED,
        runId,
      });

      browserHistory.push(`/workflow/${workflowId}/${runId}`);
      dispatch(initializeRun(workflowId, runId));
    }).catch((err) => {
      console.error(err);

      dispatch({
        type: actionConstants.RUN_SUBMITTED,
        err,
      });
    });
  };
}

export function upload(file, workflowId) {
  return (dispatch) => {
    dispatch({
      type: actionConstants.UPLOAD,
      file,
    });

    const uploadPromise = apiUtils.upload(file, workflowId);
    const readPromise = workflowUtils.readPdb(file);
    Promise.all([uploadPromise, readPromise]).then((results) => {
      if (!results[0] || !results[1]) {
        throw new Error('Missing result from upload/read');
      }

      dispatch({
        type: actionConstants.UPLOAD_COMPLETE,
        pdbUrl: results[0].pdbUrl,
        data: results[0].data,
        pdb: results[1],
      });
    }).catch(err =>
      dispatch({
        type: actionConstants.UPLOAD_COMPLETE,
        err: err ? (err.message || err) : null,
      })
    );
  };
}

export function submitPdbId(pdbId, workflowId) {
  return (dispatch) => {
    dispatch({
      type: actionConstants.SUBMIT_PDB_ID,
    });

    apiUtils.getPdbById(pdbId, workflowId).then(({ pdbUrl, pdb, data }) =>
      dispatch({
        type: actionConstants.FETCHED_PDB_BY_ID,
        pdbUrl,
        pdb,
        data,
      })
    ).catch(err =>
      dispatch({
        type: actionConstants.FETCHED_PDB_BY_ID,
        err: err.message,
      })
    );
  };
}

export function submitEmail(email) {
  return {
    type: actionConstants.SUBMIT_EMAIL,
    email,
  };
}

export function clickAbout() {
  return {
    type: actionConstants.CLICK_ABOUT,
  };
}

export function clickCancel(runId) {
  return (dispatch) => {
    dispatch({
      type: actionConstants.CLICK_CANCEL,
    });

    apiUtils.cancelRun(runId).then(() => {
      dispatch({
        type: actionConstants.SUBMITTED_CANCEL,
      });
    }).catch((err) => {
      dispatch({
        type: actionConstants.SUBMITTED_CANCEL,
        err,
      });
    });
  };
}

export function messageTimeout() {
  return {
    type: actionConstants.MESSAGE_TIMEOUT,
  };
}

export function clickColorize() {
  return {
    type: actionConstants.CLICK_COLORIZE,
  };
}

export function changeLigandSelection(ligandString) {
  return {
    type: actionConstants.CHANGE_LIGAND_SELECTION,
    ligandString,
  };
}

export function changeMorph(morph) {
  return {
    type: actionConstants.CHANGE_MORPH,
    morph,
  };
}
