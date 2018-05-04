import React, { Component } from 'react';
import { get, post } from 'axios';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Upload from './Upload';
import Tool from '../Tool';
import './style.scss';

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

  clickSample(e) {
    const _this = this;
    const { sample } = e.target.dataset;
    this.setState({ loading: true });
    get(`/api/entropy/${sample}`).then(response => {
      _this.setState({ loading: false, initView: false, data: response.data });
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
      return <div className="cotainer">Loading ...</div>;
    }
    if (initView) {
      return (
        <div className="cotainer">
          <h3>Select data samples:</h3>
          <ul className="samples">
            <li data-sample="ebola" onClick={this.clickSample}>Ebola</li>
            <li data-sample="muv" onClick={this.clickSample}>MUV</li>
          </ul>
          <p>Upload your own .fasta file:</p>
          <div className="upload">
            <Upload uploadFile={this.uploadFile} />
          </div>
        </div>
      );
    }
    return (
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div onClick={this.clickBack} className="back-btn">Back to menu</div>
        <Tool data={data} />
      </ReactCSSTransitionGroup>
    );
  }
}

export default Home;
