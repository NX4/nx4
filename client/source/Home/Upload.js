import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import FastaParser from 'biojs-io-fasta';
import action from '../actions';
import { dispatch } from '../store';
import dataParser from './dataParser';
import accepted from 'attr-accept';
import './style.scss';

const acceptFiles = accepted({})

function defineName(sequence) {
  const name = sequence.name;
  const db = Object.keys(sequence.ids)[0];
  const uid = sequence.ids[`${db}`];
  if (db === undefined && uid !== undefined) {
    return `${uid}|${name}`;
  } 
  else if (db !== undefined && uid === undefined) {
    return `${db}|${name}`;
  }
  else if (uid === undefined && uid === undefined) {
    return name;
  } 
  else return `${db}|${uid}|${name}`;
}

const sequcence = FastaParser;

export default class Upload extends Component {
  constructor() {
    super();
    this.state = { files: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const formData = new FormData();
    formData.append('fastaFile', files[0]);
    this.props.setLoading(files[0].name);
    const data = sequcence.read(files[0].preview);
    data.then(model => {
      const response = [];
      for (let i = 0; i < model.length; i++) {
        response.push({
          id: model[i].id,
          name: defineName(model[i])
        });
      }
      dispatch(action.setCurrentSequence(files[0].name, response));
      dataParser(model).then(parsedData => (
        this.props.setData(parsedData)
      ));
    });
  }

  render() {
    return (
      <section>
        <div className="dropzoneContainer">
          <Dropzone className="dropzoneArea" accept=".fasta, .fastaq"
            onDropAccepted={this.onDrop}
            onDropRejected={
              () => {dispatch(action.showErrorMessage("errorMessage", "inherit"))}
              //here we need to fire an event that either renders or shows an error message
              //there is an #errorMessage text element in index.js with visibility: none
              // console.log("rejected");
              }>
            <div>
              <span className="fas fa-upload" />
              <p>drop an aligned .fasta file or click here</p>
            </div>
          </Dropzone>
        </div>
      </section>
    );
  }
}
