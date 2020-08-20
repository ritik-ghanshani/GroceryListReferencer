import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaShoppingCart } from 'react-icons/fa';

export class NavBar extends Component {
    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand>Grocery List Referencer</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className="d-inline p-2" href="/">
                            Home
                        </Nav.Link>
                        <Nav.Link className="d-inline p-2">Products</Nav.Link>
                        <Nav.Link className="d-inline p-2">About Us</Nav.Link>
                        <Nav.Link className="d-inline p-2">Contact</Nav.Link>
                    </Nav>
                    <IconContext.Provider
                        value={{
                            color: 'white',
                            className: 'global-class-name',
                        }}
                    >
                        <div>
                            <FaShoppingCart />
                        </div>
                    </IconContext.Provider>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
