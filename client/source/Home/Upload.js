import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

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
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>
              Try dropping some files here, or click to select files to upload.
            </p>
          </Dropzone>
        </div>
      </section>
    );
  }
}
