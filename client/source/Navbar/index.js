import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/nx4_logo_2.svg';

export default class Navbar extends Component {
  render() {
    const sample = ""
    return (
      <ul className="navbar" role="navigation">
        <li className="home">
          <Link to="/"><img id="logo" alt="" src={logo} /></Link>
        </li>
        <li className="seqId">{sample != "" ? sample : ""}</li>
        <li className="about">ABOUT</li>
        <li className="docs">DOCS</li>
      </ul>
    );
  }
}
