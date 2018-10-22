import React, { Component } from 'react';
import { get, post } from 'axios';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FastaParser from 'biojs-io-fasta';
import Upload from './Upload';
import Tool from '../Tool';
import dataParser from './dataParser';
import { dispatch } from '../store';
import action from '../actions';
import './style.scss';
import logo from '../img/nx4_logo_2.svg';
import Loader from '../ShareComponents/Loader';

const sequcence = FastaParser;

import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';

const samplesURL = {
  ebola:
    'https://s3.us-east-2.amazonaws.com/static-nx4/fasta-files/171020-KGA_RAxML_bipartitions.ebov_alignment_red.fasta',
  muv:
    'https://s3.us-east-2.amazonaws.com/static-nx4/fasta-files/MuV-MDPH.aligned.pruned.fasta'
};

fontawesome.library.add(solid);

const body = document.body;
const html = document.documentElement;

const height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initView: true,
      data: []
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.clickBack = this.clickBack.bind(this);
    this.clickSample = this.clickSample.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setData = this.setData.bind(this);
  }

  uploadFile(formData) {
    const _this = this;
    this.setState({ loading: true });
    post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      _this.setState({ loading: false, initView: false, data: response.data });
    });
  }

  setLoading() {
    this.setState({ loading: true });
  }

  setData(data) {
    this.setState({ loading: false, initView: false, data });
  }

  clickSample(e) {
    const { sample } = e.target.dataset;
    this.setState({ loading: true });
    get(samplesURL[sample]).then(fasta => {
      const data = sequcence.parse(fasta.data);
      const response = [];
      for (let i = 0; i < data.length; i++) {
        response.push({
          id: data[i].id,
          name: `${Object.keys(data[i].ids)[0]}`
        });
      }
      dispatch(action.setCurrentSequence(sample, response));
      dataParser(data).then(parsedData => (
        this.setData(parsedData)
      ));
    });
  }

  clickBack(e) {
    this.setState({
      initView: true,
      data: []
    });
  }

  render() {
    const { loading, initView, data } = this.state;
    if (loading) {
      return (
        <div
          className="cotainer"
          style={{
            height: height - 110,
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          <Loader />
          Loading visualization
        </div>
      );
    }
    if (initView) {
      return (
        <div className="home" style={{ height: height - 110 }}>
          <div className="mainHomeContainer">
            <div className="leftContainer">
              <Link to="/">
                <img id="homeLogo" alt="logo image" src={logo} />
              </Link>
              <h2>
                A Multiple Sequence Alignment visualizer for viral genomics
              </h2>
              <h4>
                NX4 is a web-based visualization tool for the exploration of
                aligned viral sequences. The tool was born as an alternative to
                matrix-based MSA visualizations.
              </h4>
              <h4>
                This is an open-source project maintained by a small group of
                web-developers, visualization researchers and computational
                scientists. If you'd like to contribute, report bugs or learn
                more about the project, please{' '}
                <a href="https://github.com/NX4/nx4">
                  visit the GitHub repository.
                </a>
              </h4>
              <h4>
                Please{' '}
                <a href="https://nx4.gitbook.io/documentation/">
                  refer to the documentation to learn more about how to use this
                  tool.
                </a>{' '}
              </h4>
              <h4>
                {' '}
                Additionally if you use this tool for your work, please cite it
                as follows: [publication pending]
              </h4>
            </div>
            <div className="columnDivider" />
            <div className="upload">
              <h4>To get started upload a file</h4>

              <div className="uploader">
                <Upload
                  uploadFile={this.uploadFile}
                  setLoading={this.setLoading}
                  setData={this.setData}
                />
              </div>

              <div className="samplesContainer">
                <p>Or try one of our sample files:</p>
                <ul className="samples">
                  <li data-sample="ebola" onClick={this.clickSample}>
                    Ebola Zaire (EBOV) – 1800 samples
                  </li>
                  <li data-sample="muv" onClick={this.clickSample}>
                    Mumps Boston (MUV) – 135 samples
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <ReactCSSTransitionGroup
        transitionName="example"
        component="div"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div onClick={this.clickBack} className="back-btn">
          Back to menu
        </div>
        <Tool data={data} />
      </ReactCSSTransitionGroup>
    );
  }
}

export default Home;
