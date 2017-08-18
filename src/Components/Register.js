import React, { Component } from 'react';
import { auth } from '../Helpers/auth';

export default class Register extends Component {

  state = {
    email: '',
    pass: '',
    cpass: '',
    err: '',
  }

  handleSubmit() {
    const { email, pass } = this.state;
    auth(email, pass)
      .catch((err) => {
        this.setState({ err: 'The Email entered is invalid.'})
      })

  }
  render() {
    const { pass, cpass } = this.state;
    const passMatch = pass === cpass && pass.length > 7;
    return (
      <div>
        {this.state.err && <div className="login-error">{this.state.err}</div>}
        <label className="form-login">
          Email:
          <input type="text" name="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value})} />
        </label>
        <label className="form-login">
          Password:
          <input type="password" name="password" value={this.state.pass} onChange={(e) => this.setState({ pass: e.target.value})} />
          <div className="passHelp">Password must be longer than 6 charachters.</div>
        </label>
        <label className="form-login">
          Confirm Password:
          <input className={passMatch ? 'match' : 'dontMatch'} type="password" name="confirmPassword" value={this.state.cpass} onChange={(e) => this.setState({ cpass: e.target.value})} />
        </label>
        <button style={{cursor: 'pointer'}} className={!passMatch ? '' : 'registerButton'} disabled={!passMatch} onClick={() => this.handleSubmit()} >Register</button>
      </div>
    );
  }
}
