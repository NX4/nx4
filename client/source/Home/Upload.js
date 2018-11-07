import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import FastaParser from 'biojs-io-fasta';
import action from '../actions';
import { dispatch } from '../store';
import dataParser from './dataParser';
import './style.scss';

const customGetMeta = function(header) {
  return {
    id: 'id',
    name: 'name'
  };
};

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
      console.log(model)
      // Acá es el problema, por cada secuencia yo extraigo el name
      // en las secuencia de MuV el name es una fecha, por lo que yo busco en el parse de Ids
      // En la de Ebola y el nuevo si existe un valor name.
      // Creo que lo mejor es usar el name, aunque en MuV sea una fecha
      for (let i = 0; i < model.length; i++) {
        response.push({
          id: model[i].id,
          name: `${Object.keys(model[i].ids)[0]}`
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
