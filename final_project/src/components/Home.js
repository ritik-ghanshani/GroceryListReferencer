import React, { Component } from 'react';
// import axios from 'axios';
import { NavBar } from './NavBar';

export class Home extends Component {
    render() {
        console.log(this.props);
        return <NavBar {...this.props} />;
    }
}
