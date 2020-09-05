import React, { Component } from 'react';
import { Dropdown, Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';
import axios from 'axios';

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.validateLogoutClick = this.validateLogoutClick.bind(this);
    }

    validateLogoutClick() {
        axios
            .delete('/logout')
            .then(() => {
                this.props.validateLogout();
                this.props.history.push('/');
            })
            .catch((error) => {
                console.log('logout error', error);
            });
    }

    render() {
        const myStyle = {
            color: '#101336',
        };
        return (
            <Navbar
                style={{ background: myStyle.color }}
                expand="lg"
                variant="dark"
            >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand>Grocery List Referencer</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link
                            //{...this.props}
                            className="d-inline p-2"
                            href="/home"
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link className="d-inline p-2">Products</Nav.Link>
                        <Nav.Link
                            {...this.props}
                            className="d-inline p-2"
                            href="/about"
                        >
                            About Us
                        </Nav.Link>
                        <Nav.Link
                            {...this.props}
                            className="d-inline p-2"
                            href="/contact"
                        >
                            Contact
                        </Nav.Link>
                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle
                            style={{ background: myStyle.color }}
                            variant="dark"
                            id="dropdown-basic"
                        >
                            <IconContext.Provider
                                value={{
                                    color: 'white',
                                    className: 'global-class-name',
                                }}
                            >
                                <span>
                                    <FaUserAlt />
                                </span>
                            </IconContext.Provider>{' '}
                            {this.props.email}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/addlist">
                                Add List
                            </Dropdown.Item>
                            <Dropdown.Item href="/home">View Lists</Dropdown.Item>
                            <Dropdown.Item onClick={this.validateLogoutClick}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
