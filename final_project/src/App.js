import React, { Component } from 'react';
import './App.css';
import { Login } from './components/Login';
import axios from 'axios';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: 'NOT_LOGGED_IN',
            user: {},
        };

        this.validateLogin = this.validateLogin.bind(this);
        this.validateLogout = this.validateLogout.bind(this);
    }

    checkLoginStatus() {
        axios
            .get('/logged_in')
            .then((response) => {
                if (
                    response.data.logged_in &&
                    this.state.loggedInStatus === 'NOT_LOGGED_IN'
                ) {
                    this.setState({
                        loggedInStatus: 'LOGGED_IN',
                        user: response.data.user,
                    });
                } else if (
                    !response.data.logged_in &&
                    this.state.loggedInStatus === 'LOGGED_IN'
                ) {
                    this.setState({
                        loggedInStatus: 'NOT_LOGGED_IN',
                        user: {},
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    validateLogout() {
        this.setState({
            loggedInStatus: 'NOT_LOGGED_IN',
            user: {},
        });
    }
    validateLogin(data) {
        this.setState({
            loggedInStatus: 'LOGGED_IN',
            user: data.user,
        });
    }

    render() {
        return (
            <div className="App">
                <Login />
            </div>
        );
    }
}
