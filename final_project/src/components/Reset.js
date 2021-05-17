import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export class Reset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            reset_errors: '',
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
        const { email } = this.state;
        axios
            .post('/passwordReset', {
                user: {
                    email,
                },
            })
            .then((response) => {
                if (response.data.reset) {
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                this.setState({ reset_errors: error.response.data });
            });
        event.preventDefault();
    }

    render() {
        return (
            <div id="modal" className="App">
                <h1 id="header">Reset Page</h1>
                <form onSubmit={this.validateSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.validateChange}
                        required
                        autoFocus
                    />
                    <p className="p-error">{this.state.reset_errors}</p>
                    <button id="registerlogin" type="submit">
                        Submit
                    </button>
                    <br />
                    <p className="p">
                        Need an Account?{' '}
                        <Link className="loglink" to="/register">
                            Signup
                        </Link>
                    </p>
                    <p className="p">
                        Have an Account?{' '}
                        <Link to="/Login" className="loglink">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}
