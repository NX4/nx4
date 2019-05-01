import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/nx4_logo_2.svg';

const NavBar = ({ title, goHome }) => (
  <ul className="navbar" role="navigation">
    <li className="navHome">
      <Link to="/" onClick={() => goHome()}>
        <img id="logo" alt="" src={logo} />
      </Link>
    </li>
    <li className="seqId">{title != '' ? title : ''}</li>
    <li className="about">
      {' '}
      <a target="_blanc" href="https://github.com/NX4/nx4">
        GitHub
      </a>
    </li>
    <li className="about">
      {' '}
      <a target="_blanc" href="https://nx4.gitbook.io/documentation/">
        Guide
      </a>
    </li>
  </ul>
);

export default NavBar;
