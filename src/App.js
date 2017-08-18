import React, { Component } from 'react';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard'
import { logout } from './Helpers/auth';
import { firebaseAuth } from './config/firebase';
require('./index.css');

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
      : <Redirect to={{pathname: '/login', state: {from: props.location }}} />}
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
      : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  state={
    authed: false,
    loading: true,
  }

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        });
      }
      else {
        this.setState({
          authed: false,
          loading: false,
        });
      }
    })
  }

  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div>
          <nav className="navbar">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-header">To Do List App</Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li className="nav-list">
                  <Link to="/" className="navbar-brand">Home</Link>
                </li>
                <li className="nav-list">
                  <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
                </li>
                <li className="nav-list">
                  {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout();
                        }}
                        className="navbar-brand">Logout
                      </button>
                    : <span>
                        <Link to="/login" className="navbar-brand">Login</Link>
                        <Link to="/register" className="navbar-brand navbar-right">Register</Link>
                      </span>
                  }
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <Switch>
                <Route path="/" exact component={Home} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                <Route render={() => <h3>Page not found</h3>} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
