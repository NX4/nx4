import React, { Component } from 'react';
import logo from '../img/nx4_logo.svg';

export default class Navbar extends Component {
  render() {
    return (
      <ul className="navbar" role="navigation">
        <li className="home">
          <img id="logo" alt="" src={logo} />NX4
        </li>
        <li className="seqId">Ebov alignment – 1823 samples</li>
        <li className="about">ABOUT</li>
        <li className="docs">DOCS</li>
      </ul>
    );
  }
}
