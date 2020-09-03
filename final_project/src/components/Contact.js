import React, { Component } from 'react';
import { NavBar } from './NavBar';
import '../App.css';

export class Contact extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <div className="box">
                    <h3 id="header">Contact Us</h3>
                    <p id="desc">
                        This project was developed by Ritik S Ghanshani, Kev
                        Karnani, Anthony Goncharenko, Sameh Abedin, and Fiona
                        Sarno for Summer 2020 CS 375 course at Drexel University
                        under the supervision of Professor Long.
                        <br />
                        <br />
                        The repository for the project can be found{' '}
                        <a href="https://github.com/kevinkarnani/GroceryListReferencer">
                            here
                        </a>
                        .
                        <br />
                        <br />
                        You can contact us here:-
                        <ul>
                            <li>
                                <a href="mailto:fms58@drexel.edu">
                                    Fiona Sarno{' '}
                                </a>{' '}
                                (Backend Dev)
                            </li>
                            <li>
                                <a href="mailto:rsg87@drexel.edu">
                                    Ritik S Ghanshani{' '}
                                </a>
                                (Frontend Developer and DevOps Manager)
                            </li>
                            <li>
                                <a href="mailto:kk3286@drexel.edu">
                                    Kev Karnani{' '}
                                </a>{' '}
                                (Lead Developer and Designer)
                            </li>
                            <li>
                                <a href="mailto:amg568@drexel.edu">
                                    Anthony Goncharenko{' '}
                                </a>{' '}
                                (Frontend Dev)
                            </li>
                            <li>
                                <a href="mailto:sa3473@drexel.edu">
                                    Sameh Abedin{' '}
                                </a>{' '}
                                (Backend Dev)
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        );
    }
}
