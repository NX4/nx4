import React, { Component } from 'react';
import { select } from 'd3';
import { get as fetch } from 'axios';
// modules of the viz
import Context from './modules/context';
import Focus from './modules/focus';
import Alignment from './modules/alignment';

export default class Tool extends Component {
  generateViz(gData, entropyData) {
    const contextChart = Context();
    const focusChart = Focus();
    const alignmentChart = Alignment();

    select('#brush-container')
      .datum(entropyData)
      .call(contextChart);
    select('#overview-container')
      .datum(entropyData)
      .call(focusChart);
    select('#alignment-container')
      .datum(gData)
      .call(alignmentChart);
  }

  componentDidMount() {
    fetch('api/entropy').then(response => {
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
