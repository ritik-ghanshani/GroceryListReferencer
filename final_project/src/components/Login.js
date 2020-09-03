import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginErrors: '',
        };
        this.validateSubmit = this.validateSubmit.bind(this);
        this.validateChange = this.validateChange.bind(this);
    }

    validateChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    validateSubmit(event) {
        const { email, password } = this.state;
        axios
            .post(
                '/userSubmit', //this name is tentative
                {
                    user: {
                        email: email,
                        password: password,
                    },
                }
            )
            .then((response) => {
                if (response.data.logged_in) {
                    this.props.validateSuccesAuth(response.data);
                }
            })
            .catch((error) => {
                console.log(`login error ${error}`);
            });
        event.preventDefault();
    }

    render() {
        return (
            <div id="modal" className="App">
                <h1 id="header">Login Page</h1>
                <form>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.validateChange}
                        required
                        autoFocus
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.validateChange}
                        required
                    />
                    <br />
                    <button id="registerlogin" type="submit">
                        Login
                    </button>
                    <br />
                    <p className="p">
                        Need an Account?{' '}
                        <Link className="loglink" to="/register">
                            Signup
                        </Link>
                    </p>
                    <p className="p">
                        Forgot Password?{' '}
                        <Link to="/notFound" className="loglink">
                            Reset
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}
