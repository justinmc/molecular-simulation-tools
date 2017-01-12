import React from 'react';
import Button from './button';

import '../../css/status_results.scss';

class StatusResults extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeMorph = this.onChangeMorph.bind(this);
    this.onClickDownload = this.onClickDownload.bind(this);
  }

  onChangeMorph(e) {
    this.props.onChangeMorph(parseInt(e.target.value, 10));
  }

  onClickDownload() {
    window.location.href = this.props.outputPdbUrl;
  }

  render() {
    const value = Math.round(this.props.outputData.vde.value * 10000) / 10000;

    return (
      <div className="status-results">
        <div className="stats">
          <div className="stat">
            <div className="fontHeader line stat-title">
              <div>OUTPUT ENERGY</div>
              <div>{this.props.outputData.vde.units}</div>
            </div>
            <div className="stat-body">
              <div className="stat-body-item">
                <div className="fontLarge">{value}</div>
              </div>
            </div>
          </div>
          <div>
            <label className="fontHeader morph-label" htmlFor="morph">MORPH</label>
            <input
              id="morph"
              type="range"
              min="0"
              max="1"
              step="1"
              onChange={this.onChangeMorph}
            />
          </div>
          <Button
            type="small"
            onClick={this.props.onClickColorize}
          >
            Colorize
          </Button>
        </div>
        <div className="actions">
          <Button
            type="form"
            onClick={this.onClickDownload}
          >
            Download
          </Button>
          <Button
            type="small"
          >
            Share
          </Button>
        </div>
      </div>
    );
  }
}

StatusResults.propTypes = {
  onClickColorize: React.PropTypes.func.isRequired,
  onChangeMorph: React.PropTypes.func.isRequired,
  outputPdbUrl: React.PropTypes.string,
  workflowNodesSize: React.PropTypes.number,
  outputData: React.PropTypes.object,
};

export default StatusResults;
