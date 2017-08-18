import React, { Component } from 'react';
import { login } from '../Helpers/auth';

export default class Login extends Component {

  state={
    email: '',
    pass: '',
    cpass: '',
  }

  handleSubmit() {
    const { email, pass, cpass } = this.state;
    if (pass === cpass) {
      login(email, pass)
        .catch((err) => {
          this.setState({ err: 'Invalid Username / Password'});
        })
    }
    this.setState({email: '', pass: '', cpass: ''});

  }

  render() {
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
        </label>
        <label className="form-login">
          Confirm Password:
          <input type="password" name="confirmPassword" value={this.state.cpass} onChange={(e) => this.setState({ cpass: e.target.value})} />
        </label>
        <button onClick={() => this.handleSubmit()} >Submit</button>
      </div>
    );
  }
}
