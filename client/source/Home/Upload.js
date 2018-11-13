import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import FastaParser from 'biojs-io-fasta';
import action from '../actions';
import { dispatch } from '../store';
import dataParser from './dataParser';
import './style.scss';

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
  }

  onDrop(files) {
    this.props.setLoading();
    const formData = new FormData();
    formData.append('fastaFile', files[0]);
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
          <Dropzone className="dropzoneArea" onDrop={this.onDrop.bind(this)}>
            <div>
              <p className="fas fa-upload" />
              <p>drop an aligned .fasta file or click here</p>
            </div>
          </Dropzone>
        </div>
      </section>
    );
  }
}
