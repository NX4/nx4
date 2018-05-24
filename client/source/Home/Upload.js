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
          <Dropzone className="dropzoneArea" onDrop={this.onDrop.bind(this)}>
            <div>
              <p className="fas fa-upload"></p>
              <p>drop an aligned .fasta file or click here</p>
            </div>
          </Dropzone>
        </div>
      </section>
    );
  }
}
