import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            password_confirmation: '',
            registrationErrors: '',
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
        const { email, password, password_confirmation } = this.state;

        axios
            .post('/register', {
                user: {
                    email,
                    password,
                    password_confirmation,
                },
            })
            .then((response) => {
                if (response.data.status === 'created') {
                    this.props.validateLogin(response.data);
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                console.log('registration error', error);
            });
        event.preventDefault();
    }

    render() {
        return (
            <div id="modal" className="App">
                <h1 id="header">Registration Page</h1>
                <form onSubmit={this.validateSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.validateChange}
                        autoFocus
                        required
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
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Password confirmation"
                        value={this.state.password_confirmation}
                        onChange={this.validateChange}
                        required
                    />
                    <br />
                    <button id="registerlogin" type="submit">
                        Register
                    </button>
                    <br />
                    <p className="p">
                        Have an Account?{' '}
                        <Link className="loglink" to="/">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}
