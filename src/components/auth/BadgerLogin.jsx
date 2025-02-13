import React, { useRef, useContext, useEffect } from 'react';
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { useNavigate } from "react-router-dom";

export default function BadgerLogin() {
    const usernameRef = useRef();
    const pinRef = useRef();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();
    const pinRegex = /^\d{7}$/;

    const handleLogin = (e) => {
        e.preventDefault();

        const username = usernameRef.current.value;
        const pin = pinRef.current.value;

        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!pinRegex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/login", {
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, pin })
        })
        .then(res => {
            if (res.status === 200) { // OK!
                alert("Login successful! Welcome back!");
                setLoginStatus(true);
                sessionStorage.setItem("loginStatus", loginStatus); 
                sessionStorage.setItem("username", username);
                navigate("/"); 
            } else if (res.status === 401) { // Unauthorized
                alert("Incorrect username or pin!");
            } else {
                alert("An error occurred during login.");
            }
        })
        .catch(() => {
            alert("An error occurred during login.");
        });
    };

    return (
        <div style={{ margin: "1.5rem" }}>
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
                <FormGroup>
                    <FormLabel htmlFor="usernameInput">Username</FormLabel>
                    <FormControl id="usernameInput" type="text" ref={usernameRef} placeholder="Enter your username" />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="pinInput">Pin</FormLabel>
                    <FormControl id="pinInput" type="password" ref={pinRef} placeholder="Enter your 7-digit pin" />
                </FormGroup>
                <Button type="submit">Login</Button>
            </Form>
        </div>
    );
}
