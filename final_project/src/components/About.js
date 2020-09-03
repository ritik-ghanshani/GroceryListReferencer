import React, { Component } from 'react';
import { NavBar } from './NavBar';
import '../App.css';

export class About extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <div className="box">
                    <h3 id="header">About Us</h3>
                    <p id="desc">
                        Initially conceived as a part of a class project, this
                        multi-billion dollar worthy Grocery List website was
                        developed by 5 young minds in a span of 5 weeks.
                        <br />
                        <br />
                        This application's main appeal is the ease of managing
                        Grocery Lists and checking if the desired item is in
                        stock at the store.
                        <br />
                        <br />
                        We currently support the following features:
                        <ul>
                            <li>User accounts to save lists</li>
                            <li>Multiple Lists Support</li>
                            <li>Integration with Store API</li>
                        </ul>
                    </p>
                </div>
            </div>
        );
    }
}
