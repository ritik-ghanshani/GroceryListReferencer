import React, { Component } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Register } from './components/Register';
import NotFound from './components/NotFound';
import axios from 'axios';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Contact } from './components/Contact';
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedInStatus: 'NOT_LOGGED_IN',
            email: '',
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
                        email: response.data.email,
                    });
                } else if (
                    !response.data.logged_in &&
                    this.state.loggedInStatus === 'LOGGED_IN'
                ) {
                    this.setState({
                        loggedInStatus: 'NOT_LOGGED_IN',
                        email: '',
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
            email: '',
        });
    }
    validateLogin(data) {
        this.setState({
            loggedInStatus: 'LOGGED_IN',
            email: data.email,
        });
    }
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={'/'}
                            render={(props) => (
                                <Login
                                    {...props}
                                    validateLogin={this.validateLogin}
                                    loggedInStatus={this.state.loggedInStatus}
                                />
                            )}
                        />
                        <Route
                            path={'/home'}
                            render={(props) => (
                                <Home
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    validateLogout={this.validateLogout}
                                    email={this.state.email}
                                />
                            )}
                        />
                        <Route
                            path={'/register'}
                            render={(props) => (
                                <Register
                                    {...props}
                                    validateLogin={this.validateLogin}
                                    loggedInStatus={this.state.loggedInStatus}
                                />
                            )}
                        />
                        <Route
                            path={'/about'}
                            render={(props) => (
                                <About
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    validateLogout={this.validateLogout}
                                />
                            )}
                        />
                        <Route
                            path={'/contact'}
                            render={(props) => (
                                <Contact
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    validateLogout={this.validateLogout}
                                />
                            )}
                        />
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}
