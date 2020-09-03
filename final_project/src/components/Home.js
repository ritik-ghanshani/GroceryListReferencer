import React, { Component } from 'react';
import axios from 'axios';
import { NavBar } from './NavBar';
// import Register from './Register';
// import Login from './Login';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.validateSuccessfulAuth = this.validateSuccessfulAuth.bind(this);
        this.validateLogoutClick = this.validateLogoutClick.bind(this);
    }

    validateSuccessfulAuth(data) {
        this.props.validateLogin(data);
    }

    validateLogoutClick() {
        axios
            .delete('/logout')
            .then((response) => {
                this.props.validateLogout();
            })
            .catch((error) => {
                console.log('logout error', error);
            });
    }
    render() {
        return <NavBar />;
    }
}
