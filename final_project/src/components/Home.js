import React, { Component } from 'react';
// import axios from 'axios';
import { NavBar } from './NavBar';
import { ViewLists } from './ViewLists';
import '../App.css';

export class Home extends Component {
    render() {
        return (
            <div id="container">
                <NavBar {...this.props} />
                <ViewLists {...this.props} />
            </div>
        );
    }
}
