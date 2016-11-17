import React from 'react';
import { List as IList } from 'immutable';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'material-ui/List';
import Node from './node.jsx';
import SelectionRecord from '../records/selection_record';
import WorkflowRecord from '../records/workflow_record';
import WorkflowTitle from '../components/workflow_title.jsx';
import selectionConstants from '../constants/selection_constants';
import statusConstants from '../constants/status_constants';

require('../../css/workflow.scss');

class Workflow extends React.Component {
  constructor(props) {
    super(props);

    this.onUpload = this.onUpload.bind(this);
  }

  onUpload(e) {
    this.props.onUpload(e.target.files[0]);
  }

  render() {
    const running = this.props.workflowStatus === statusConstants.RUNNING;
    const hasWorkflowNodes = this.props.workflow.workflowNodes.size;

    let uploadElement;
    if (this.props.uploadUrl) {
      uploadElement = (
        <div>
          <p>
            Uploaded:
            <a href={this.props.uploadUrl}>{this.props.uploadUrl}</a>
          </p>
        </div>
      );
    } else if (!this.props.workflow.workflowNodes.size) {
      uploadElement = (
        <div className="upload-container">
          <FlatButton
            style={{ margin: '0 auto' }}
            containerElement="label"
            label="Upload PDB"
            disabled={this.props.uploadPending}
          >
            <input
              type="file"
              onChange={this.onUpload}
              disabled={this.props.uploadPending}
            />
          </FlatButton>
          <div className="error">
            {this.props.uploadError}
          </div>
        </div>
      );
    }

    return (
      <div className="workflow">
        <div className="header">
          Workflow
        </div>
        <div className="pane-container">
          <WorkflowTitle
            workflow={this.props.workflow}
            selection={this.props.selection}
            onClick={this.props.clickWorkflow}
            onDrop={this.props.onDropWorkflowTitle}
            workflowStatus={this.props.workflowStatus}
          />
          {uploadElement}
          <List>
            {
              this.props.workflow.workflowNodes.map(
                (workflowNode, index) => {
                  const workflowNodeSelected =
                    this.props.selection.type === selectionConstants.WORKFLOW_NODE;
                  const node = this.props.nodes.find(nodeI => nodeI.id === workflowNode.nodeId);
                  return (
                    <Node
                      key={index}
                      node={node}
                      status={workflowNode.status}
                      selected={workflowNodeSelected && workflowNode.id === this.props.selection.id}
                      onClick={this.props.clickWorkflowNode}
                      onDrop={this.props.onDropNode}
                      onDragStart={this.props.onDragStart}
                      workflowNodeId={workflowNode.id}
                    />
                  );
                }
              )
            }
          </List>
          <button
            className="button is-primary is-medium run"
            onClick={this.props.clickRun}
            disabled={running || !hasWorkflowNodes}
          >
            Run Workflow
          </button>
        </div>
      </div>
    );
  }
}

Workflow.propTypes = {
  clickRun: React.PropTypes.func.isRequired,
  clickWorkflowNode: React.PropTypes.func.isRequired,
  clickWorkflow: React.PropTypes.func.isRequired,
  onDropNode: React.PropTypes.func.isRequired,
  onDropWorkflowTitle: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func.isRequired,
  onUpload: React.PropTypes.func.isRequired,
  workflow: React.PropTypes.instanceOf(WorkflowRecord),
  workflowStatus: React.PropTypes.string,
  nodes: React.PropTypes.instanceOf(IList),
  selection: React.PropTypes.instanceOf(SelectionRecord).isRequired,
  uploadPending: React.PropTypes.bool.isRequired,
  uploadError: React.PropTypes.string,
  uploadUrl: React.PropTypes.string,
};

export default Workflow;