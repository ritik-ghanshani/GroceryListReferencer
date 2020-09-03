import React, { Component } from 'react';
import { Dropdown, Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaUserAlt } from 'react-icons/fa';

export class NavBar extends Component {
    render() {
        console.log(this.props);
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand>Grocery List Referencer</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="d-inline p-2" href="/home">
                            Home
                        </Nav.Link>
                        <Nav.Link className="d-inline p-2">Products</Nav.Link>
                        <Nav.Link className="d-inline p-2">About Us</Nav.Link>
                        <Nav.Link className="d-inline p-2">Contact</Nav.Link>
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
                            {this.props.email.email}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Add List</Dropdown.Item>
                            <Dropdown.Item>View Lists</Dropdown.Item>
                            <Dropdown.Item
                                onClick={this.props.validateLogoutClick}
                            >
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
