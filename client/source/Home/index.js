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
  ebolaGire: {
    url:
      'https://s3.us-east-2.amazonaws.com/static-nx4/fasta-files/ebov.mafft.fasta',
    title: 'ebov.mafft.fasta',
  },
  ebola: {
    url:
      'https://s3.us-east-2.amazonaws.com/static-nx4/fasta-files/171020-KGA_RAxML_bipartitions.ebov_alignment_red.fasta',
    title: '171020-KGA_RAxML_bipartitions.ebov_alignment_red.fasta',
  },
  rotaVirus: {
    url:
      'https://s3.us-east-2.amazonaws.com/static-nx4/fasta-files/Reoviridae---Rotavirus---Rotavirus_A---6.aligned.fasta',
    title: 'Reoviridae---Rotavirus---Rotavirus_A---6.aligned.fasta',
  },
};

fontawesome.library.add(solid);

const body = document.body;
const html = document.documentElement;

function defineName(sequence) {
  const name = sequence.name;
  const db = Object.keys(sequence.ids)[0];
  const uid = sequence.ids[`${db}`];
  if (db === undefined && uid !== undefined) {
    return `${uid}|${name}`;
  } else if (db !== undefined && uid === undefined) {
    return `${db}|${name}`;
  } else if (uid === undefined && uid === undefined) {
    return name;
  } else return `${db}|${uid}|${name}`;
}

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
      data: [],
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
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      _this.setState({ loading: false, initView: false, data: response.data });
    });
  }

  setLoading(title) {
    if (title) this.props.updateTitle(title);
    this.setState({ loading: true });
  }

  setData(data) {
    this.setState({ loading: false, initView: false, data });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.home === true && prevState.initView === false) {
      this.setState({
        initView: true,
        data: [],
      });
      this.props.updateTitle('');
    }
  }

  clickSample(sample) {
    this.setState({ loading: true });
    this.props.updateTitle(samplesURL[sample].title);
    get(samplesURL[sample].url).then((fasta) => {
      const data = sequcence.parse(fasta.data);
      const response = [];
      for (let i = 0; i < data.length; i++) {
        response.push({
          id: data[i].id,
          name: defineName(data[i]),
        });
      }
      dispatch(action.setCurrentSequence(sample, response));
      dataParser(data).then((parsedData) => this.setData(parsedData));
    });
  }

  clickBack(e) {
    this.setState({
      initView: true,
      data: [],
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
            overflow: 'hidden',
          }}
        >
          <Loader />
          Loading visualization
        </div>
      );
    }
    if (initView) {
      return (
        <ReactCSSTransitionGroup
          transitionName="example"
          component="div"
          transitionAppear={false}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
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
                  aligned viral sequences. The tool was born as an alternative
                  to matrix-based MSA visualizations.
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
                    refer to the user guide to learn more about how to use this
                    tool.
                  </a>{' '}
                </h4>
                <h4 id="citation">
                  {' '}
                  Additionally, if you use this tool for your work, please cite
                  it as follows:
                </h4>
                <h4>
                  A Solano-Roman, C Cruz-Castillo, D Offenhuber, A Colubri, NX4:
                  a web-based visualization of large multiple sequence
                  alignments, Bioinformatics, Volume 35, Issue 22, 15 November
                  2019, Pages 4800–4802,
                  <a
                    target="_blank"
                    href="https://doi.org/10.1093/bioinformatics/btz457"
                  >
                    https://doi.org/10.1093/bioinformatics/btz457
                  </a>
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
                  <h5 id="errorMessage">
                    Error: It seems we don't support this file format. NX4 reads
                    .fasta files. Please see the user guide for supported
                    formats
                  </h5>
                  <p>
                    Or try one of our sample files below.
                    <br />
                    <a
                      href="https://nx4.gitbook.io/documentation/"
                      target="_blank"
                    >
                      Visit the user guide
                    </a>{' '}
                    for data sources and files.
                  </p>
                  <ul className="samples">
                    <li
                      onClick={() => {
                        this.clickSample('ebolaGire');
                      }}
                    >
                      <span>101 Sequences – Ebola (EBOV)</span>
                      <br />
                      Gire et al., Genomic surveillance elucidates Ebola virus
                      origin and transmission during the 2014 outbreak, Science,
                      2014.
                    </li>
                    <li
                      onClick={() => {
                        this.clickSample('ebola');
                      }}
                    >
                      <span>1,824 Sequences – Ebola (EBOV)</span>
                      <br />
                      Compiled from a collection of sources referenced in Park
                      et al., Ebola Virus Epidemiology, Transmission, and
                      Evolution during Seven Months in Sierra Leone, Cell, 2015.
                    </li>
                    <li
                      onClick={() => {
                        this.clickSample('rotaVirus');
                      }}
                    >
                      <span>5,369 Sequences – Rotavirus A</span>
                      <br />
                      Generated at the Sabeti Laboratory at the Broad Institute
                      of MIT and Harvard using MAFFT v7.31.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ReactCSSTransitionGroup>
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
        <Tool data={data} />
      </ReactCSSTransitionGroup>
    );
  }
}

export default Home;
