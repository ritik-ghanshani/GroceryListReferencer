import React, { Component } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Register } from './components/Register';
import { Reset } from './components/Reset';
import NotFound from './components/NotFound';
import axios from 'axios';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AddList } from './components/AddList';
import { ModifyList } from './components/ModifyList';
import { Products } from './components/Products';

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
        if (data.email.includes('.')) {
            data.email = data.email.slice(0, data.email.indexOf('.'));
        }
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
                            path={'/reset'}
                            render={(props) => <Reset {...props} />}
                        />
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/home'}
                                render={(props) => (
                                    <Home
                                        {...props}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                        email={this.state.email}
                                        checkLoginStatus={this.checkLoginStatus}
                                    />
                                )}
                            />
                        )}
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/about'}
                                render={(props) => (
                                    <About
                                        {...props}
                                        email={this.state.email}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                    />
                                )}
                            />
                        )}
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/contact'}
                                render={(props) => (
                                    <Contact
                                        {...props}
                                        email={this.state.email}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                    />
                                )}
                            />
                        )}
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/addlist'}
                                render={(props) => (
                                    <AddList
                                        {...props}
                                        email={this.state.email}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                    />
                                )}
                            />
                        )}
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/modify'}
                                render={(props) => (
                                    <ModifyList
                                        {...props}
                                        email={this.state.email}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                    />
                                )}
                            />
                        )}
                        {this.state.loggedInStatus === 'LOGGED_IN' && (
                            <Route
                                path={'/products'}
                                render={(props) => (
                                    <Products
                                        {...props}
                                        email={this.state.email}
                                        loggedInStatus={
                                            this.state.loggedInStatus
                                        }
                                        validateLogout={this.validateLogout}
                                    />
                                )}
                            />
                        )}
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}
