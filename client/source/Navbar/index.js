import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/nx4_logo_2.svg';

export default class Navbar extends Component {
  render() {
    const sample = ""
    return (
      <ul className="navbar" role="navigation">
        <li className="navHome">
          <Link to="/"><img id="logo" alt="" src={logo} /></Link>
        </li>
        <li className="seqId">{sample != "" ? sample : ""}</li>
        <li className="about"> <a target="_blanc" href="https://github.com/NX4/nx4">GitHub</a></li>
        <li className="about"> <a target="_blanc" href="https://nx4.gitbook.io/documentation/">Guide</a></li>
      </ul>
    );
  }
}
