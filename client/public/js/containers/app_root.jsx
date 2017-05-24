import { connect } from 'react-redux';
import App from '../components/app';
import {
  changeLigandSelection,
  changeMorph,
  clickAbout,
  clickCancel,
  clickColorize,
  clickRun,
  clickWidget,
  initializeRun,
  initializeApp,
  messageTimeout,
  submitEmail,
  submitInputString,
  selectInputFile,
} from '../actions';

function mapStateToProps(state, ownProps) {
  return {
    app: state.app,
    appId: ownProps.params.appId,
    colorized: state.resultsSettings.colorized,
    morph: state.resultsSettings.morph,
    runId: ownProps.params.runId,
    selection: state.selection,
    userMessage: state.userMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLigandSelection(runId, pipeDatasByWidget) {
      return (ligand) => {
        dispatch(changeLigandSelection(runId, pipeDatasByWidget, ligand));
      };
    },
    clickAbout() {
      dispatch(clickAbout());
    },
    clickRun(appId, runId, email, pipeDatasByWidget, inputString) {
      return (widget) => {
        dispatch(clickRun(
          appId, widget, runId, email, pipeDatasByWidget, inputString,
        ));
      };
    },
    clickWidget(widgetIndex) {
      dispatch(clickWidget(widgetIndex));
    },
    initializeRun(appId, runId) {
      dispatch(initializeRun(appId, runId));
    },
    initializeApp: (app) => (appId) => {
      dispatch(initializeApp(appId, app));
    },
    onClickColorize() {
      dispatch(clickColorize());
    },
    onChangeMorph(morph) {
      dispatch(changeMorph(morph));
    },
    onMessageTimeout() {
      dispatch(messageTimeout());
    },
    onSelectInputFile(appId, runId, pipeDatasByWidget) {
      return (file) => {
        dispatch(selectInputFile(file, appId, runId, pipeDatasByWidget));
      };
    },
    submitInputString(appId, runId, pipeDatasByWidget) {
      return (input) => {
        dispatch(submitInputString(input, appId, runId, pipeDatasByWidget));
      };
    },
    submitEmail(appId, runId, pipeDatasByWidget) {
      return (email) => {
        dispatch(submitEmail(email, appId, runId, pipeDatasByWidget));
      };
    },
    clickCancel(runId) {
      return () => {
        dispatch(clickCancel(runId));
      };
    },
  };
}

function mergeProps(stateProps, dispatchProps) {
  return Object.assign({}, dispatchProps, stateProps, {
    initializeApp: dispatchProps.initializeApp(
      stateProps.app,
    ),
    clickRun: dispatchProps.clickRun(
      stateProps.app.id,
      stateProps.app.run.id,
      stateProps.app.run.email,
      stateProps.app.run.pipeDatasByWidget,
      stateProps.app.run.inputString,
    ),
    clickCancel: dispatchProps.clickCancel(stateProps.app.run.id),
    onSelectInputFile: dispatchProps.onSelectInputFile(
      stateProps.app.id,
      stateProps.app.run.id,
      stateProps.app.run.pipeDatasByWidget,
    ),
    submitInputString: dispatchProps.submitInputString(
      stateProps.app.id,
      stateProps.app.run.id,
      stateProps.app.run.pipeDatasByWidget,
    ),
    changeLigandSelection: dispatchProps.changeLigandSelection(
      stateProps.app.run.id,
      stateProps.app.run.pipeDatasByWidget,
    ),
    submitEmail: dispatchProps.submitEmail(
      stateProps.app.id,
      stateProps.app.run.id,
      stateProps.app.run.pipeDatasByWidget,
    ),
  });
}

const AppRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App);

export default AppRoot;
