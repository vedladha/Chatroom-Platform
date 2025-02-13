import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/uw-crest.svg';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout({ chatrooms }) {
    
    const [loginStatus, setLoginStatus] = useState(() => {
        return sessionStorage.getItem("loginStatus") === "true";
    });

    //useEffect(() => {
      //  if (loginStatus) {
        //  sessionStorage.setItem("loginStatus", JSON.stringify(loginStatus));
     //   } //else {
          //sessionStorage.removeItem("loginStatus");
       // }
     // }, [loginStatus]);
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus ? (
                            <Nav.Link as={Link} to="/logout" onClick={() => { setLoginStatus(false); sessionStorage.setItem("loginStatus", "false"); }}>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        )}
                        <NavDropdown title="Chatrooms">
                            {chatrooms.length > 0 ? (
                                chatrooms.map(chatroom => (
                                    <NavDropdown.Item
                                        key={chatroom}
                                        as={Link}
                                        to={`/chatrooms/${chatroom}`}
                                    >
                                        {chatroom}
                                    </NavDropdown.Item>
                                ))
                            ) : (
                                <NavDropdown.Item disabled>No chatrooms available</NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;
