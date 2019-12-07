import React, { Component } from 'react';
import { selectAll } from 'd3';
import ReactJson from 'react-json-view';
// modules of the viz
import Context from './modules/context';
import Focus from './modules/focus';
import Alignment from './modules/alignment';
import SlidingPane from 'react-sliding-pane';

import './style.scss';

const closePanel = () => <span className="fas fa-chevron-left" />;

export default class Tool extends Component {
  constructor(props) {
    super(props);
    // this.contextChart;
    // this.focusChart;
    // this.alignmentChart;
    this.clickOnRect = this.clickOnRect.bind(this);
    this.state = {
      secOnSelection: [],
      typeSelection: null,
      posSelection: null,
      panelOpen: false
    };
  }

  clickOnRect(position, type, seqs) {
    this.setState({
      posSelection: position + 1,
      typeSelection: type,
      secOnSelection: seqs,
      panelOpen: true
    });
  }

  generateViz(gData, entropyData) {
    this.contextChart = new Context('#brush-container');
    this.focusChart = new Focus('#overview-container');
    this.alignmentChart = new Alignment(
      '#alignment-container',
      this.clickOnRect
    );

    this.contextChart.render(entropyData);
    this.focusChart.render(entropyData);
    this.alignmentChart.render(gData);
  }

  componentWillUnmount() {
    this.contextChart.unmountViz();
    this.focusChart.unmountViz();
    this.alignmentChart.unmountViz();
    selectAll('svg').remove();
  }

  componentDidMount() {
    this.generateViz(this.props.data[0], this.props.data[1]);
  }

  render() {
    return (
      <div id="main-container">
        <div className="context-main">
          <h4 className="subheadings">Sequence overview</h4>
          <div id="brush-container" />
        </div>
        <div className="focus-main">
          <h4 className="subheadings">Filtered range</h4>
          <div id="overview-container" />
        </div>
        <div className="alignment-main">
          <div id="alignment-container" />
        </div>
        <SlidingPane
          closeIcon={closePanel()}
          isOpen={this.state.panelOpen}
          title={
            <div className="side-panel-head">
              Sequences with nucleotide <b>{this.state.typeSelection}</b> at
              position <b>{this.state.posSelection}</b>
            </div>
          }
          from="right"
          width="400px"
          onRequestClose={() => this.setState({ panelOpen: false })}
        >
          <div>
            {' '}
            <ReactJson
              src={this.state.secOnSelection}
              collapsed={false}
              displayDataTypes={false}
              iconStyle="square"
              name={
                this.state.typeSelection
                  ? `${this.state.typeSelection}_${this.state.posSelection}`
                  : 'selected'
              }
            />
          </div>
        </SlidingPane>
      </div>
    );
  }
}
