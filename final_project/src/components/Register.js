import React, { Component } from 'react';
import axios from 'axios';
import { NavBar } from './NavBar';

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
                    this.props.validateSuccessfulAuth(response.data);
                }
            })
            .catch((error) => {
                console.log('registration error', error);
            });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <NavBar />
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
                    <button type="submit">Register</button>
                    <br />
                    <a href="/">Login</a>
                </form>
            </div>
        );
    }
}
