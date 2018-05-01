import React, { Component } from 'react';
import { select, selectAll } from 'd3';
import { get as fetch } from 'axios';
// modules of the viz
import Context from './modules/context';
import Focus from './modules/focus';
import Alignment from './modules/alignment';

export default class Tool extends Component {
  constructor(props) {
    super(props);
    this.contextChart;
    this.focusChart;
    this.alignmentChart;
  }

  generateViz(gData, entropyData) {
    this.contextChart = new Context('#brush-container');
    this.focusChart = new Focus('#overview-container');
    this.alignmentChart = new Alignment('#alignment-container');

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
    const { sample } = this.props.match.params;
    fetch(`/api/entropy/${sample}`).then(response => {
      this.generateViz(response.data[0], response.data[1]);
    });
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
      </div>
    );
  }
}
