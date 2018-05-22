import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import './style.scss';

var svgStyle = {
  fill: 'none',
  stroke: 'black',
  strokeWeight: '1px'
}

export default class Upload extends Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  onDrop(files) {
    const formData = new FormData();
    formData.append('fastaFile', files[0]);
    this.props.uploadFile(formData)
  }

  render() {
    return (
      <section>
        <div className="dropzoneContainer">
          {/* <svg width="100%" height="180">
            <rect x="5" y="5" rx="10" ry="10" width="150" height="150" strokeDasharray="10, 5"
              style={svgStyle} />
          </svg> */}
          <Dropzone className="dropzoneArea" onDrop={this.onDrop.bind(this)}>
            <p>
              drop an aligned .fasta file here
            </p>
          </Dropzone>
        </div>
      </section>
    );
  }
}
