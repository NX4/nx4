// import dependencies
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import main components
import Home from './Home';
import Navbar from './Navbar';
import Footer from './Footer';
// import styles
import './style.scss';
import 'react-sliding-pane/dist/react-sliding-pane.css';

// define application Routes
class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      home: true
    };
    this.updateNavTitle = this.updateNavTitle.bind(this);
    this.clickLogo = this.clickLogo.bind(this);
  }

  updateNavTitle(title) {
    this.setState({ title });
  }

  clickLogo() {
    this.setState({ home: true });
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar title={this.state.title} goHome={this.clickLogo} />
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <Home
                  home={this.state.home}
                  updateTitle={this.updateNavTitle}
                />
              )}
            />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

render(<AppRouter />, document.getElementById('root'));
