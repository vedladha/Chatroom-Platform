import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("loginStatus", loginStatus); 
        sessionStorage.setItem("username", username);

    }, [loginStatus]);

    const pinRegex = /^\d{7}$/;

    const handleRegister = (e) => {
        e.preventDefault();

        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        if (!pinRegex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/register", {
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            credentials: "include",  
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        .then(response => {
            if (response.status === 200) { // OK!
                alert("Registered successfully!");
                setLoginStatus(true);  
                navigate("/");  
            } else if (reponse.status === 409) { // Conflict
                alert("That username has already been taken!");
            } else {
                alert("Error registering user.");
            }
        })
        .catch(() => {
            alert("Error registering user.");
        });
    };

    return (
        <div style={{ margin: "1rem" }}>
            <h1>Register</h1>
            <Form style={{ margin: "0.25rem" }} onSubmit={handleRegister}>
                <FormGroup style={{ marginBottom: "1rem" }}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </FormGroup>
                <FormGroup style={{ marginBottom: "1rem" }}>
                    <FormLabel htmlFor="pin">Pin</FormLabel>
                    <FormControl
                        id="pin"
                        type="password" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter your 7-digit pin"
                    />
                </FormGroup>
                <FormGroup style={{ marginBottom: "1rem" }}>
                    <FormLabel htmlFor="pinConfirmed">Confirm Pin</FormLabel>
                    <FormControl
                        id="pinConfirmed"
                        type="password" 
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="Confirm your 7-digit pin"
                    />
                </FormGroup>
                <Button variant="primary" style={{minWidth: "5%"}} type="submit">
                    Register
                </Button>
            </Form>
        </div>
    );
}
