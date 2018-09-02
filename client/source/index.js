// import dependencies
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { getState, dispatch, observe } from './store';
// import main components
import Home from './Home';
import Tool from './Tool';
import Navbar from './Navbar';
import Footer from './Footer';
// import styles
import './style.scss';

// define application Routes
const AppRouter = () => (
  <Router>
    <div>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/tool/:sample" component={Tool} />
      </Switch>
      <Footer />
    </div>
  </Router>
);

// Render app to DOM
render(<AppRouter />, document.querySelector('#app'));
