import React, { Component } from 'react';
import axios from 'axios';
import { NavBar } from './NavBar';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.validateLogoutClick = this.validateLogoutClick.bind(this);
    }

    validateLogoutClick() {
        axios
            .delete('/logout')
            .then((response) => {
                this.props.validateLogout();
                this.props.history.push('/');
            })
            .catch((error) => {
                console.log('logout error', error);
            });
    }
    render() {
        return (
            <NavBar
                {...this.props}
                validateLogoutClick={this.validateLogoutClick}
            />
        );
    }
}
