import React, { Component } from 'react';
import { Dropdown, Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaUserAlt, FaRegBell } from 'react-icons/fa';

export class NavBar extends Component {
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
                        <Nav.Link className="d-inline p-2" href="/home">
                            Home
                        </Nav.Link>
                        <Nav.Link className="d-inline p-2">Products</Nav.Link>
                        <Nav.Link className="d-inline p-2" href="/about">
                            About Us
                        </Nav.Link>
                        <Nav.Link className="d-inline p-2" href="/contact">
                            Contact
                        </Nav.Link>
                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
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
                            John Doe
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
