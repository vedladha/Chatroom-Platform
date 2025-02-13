import React, { useEffect, useState, useContext } from "react"; 
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap"; 
import BadgerMessage from "./BadgerMessage"; 
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"; 

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]); 
    const [username, setUsername] =  useState(sessionStorage.getItem("username")); 
    const [currentPage, setcurrentPage] = useState(1); 
    const [postTitle, setPostTitle] = useState(""); 
    const [postContent, setPostContent] = useState(""); 
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = (page) => { 
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${page}`, { 
            headers: { 
                "X-CS571-ID": CS571.getBadgerId() 
            } 
        }).then(res => res.json()).then(json => { 
            setMessages(json.messages); 
        }); 
    }; 

    useEffect(() => { 
        loadMessages(currentPage); 
    }, [props, currentPage]); 

    const handlePostSubmit = (e) => { 
        e.preventDefault(); 
        if (!loginStatus) {
            alert("You must be logged in to post!");
            return;
        }

        if (!postTitle || !postContent) { 
            alert("You must provide both a title and content!"); 
            return; 
        } 

        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}`, { 
            method: "POST", 
            headers: { 
                "Content-Type": "application/json", 
                "X-CS571-ID": CS571.getBadgerId() 
            }, 
            credentials: "include", 
            body: JSON.stringify({ 
                title: postTitle, 
                content: postContent 
            }) 
        }).then(res => { 
            if (res.ok) { 
                alert("Successfully posted!"); 
                setPostTitle(""); 
                setPostContent(""); 
                loadMessages(currentPage); 
            } 
        }); 
    }; 

    const handleDeletePost = (messageId) => {
        console.log(messageId + "message")
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${messageId}`, {
            method: 'DELETE',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(response => {
            return response.json()
        })  
        .then(data => {
            console.log(data);
            if (data.error) {
                console.error('Error from server:', data.error);
            } else {
                alert('Successfully deleted the post!');
                loadMessages(currentPage);
            }
        })
        .catch(error => {
            console.error("Error deleting post:", error);
        });
    };


    const paginationItems = []; 
    for (let page = 1; page <= 4; page++) { 
        paginationItems.push( 
            <Pagination.Item 
                key={page} 
                active={page === currentPage} 
                onClick={() => setcurrentPage(page)} 
            > 
                {page} 
            </Pagination.Item> 
        ); 
    } 

    console.log("login " + loginStatus)

    return ( 
        <Container fluid> 
            <h1>{props.name} Chatroom</h1> 
            <Row> 
                <Col xs={12} md={4} style={{padding: "1rem" }}> 
                    <Form onSubmit={handlePostSubmit} className="mb-4"> 
                        <Form.Group controlId="postTitle"> 
                            <Form.Label>Post Title</Form.Label> 
                            <Form.Control 
                                type="text" 
                                value={postTitle} 
                                onChange={(e) => setPostTitle(e.target.value)} 
                                required 
                            /> 
                        </Form.Group> 
                        <Form.Group controlId="postContent"> 
                            <Form.Label>Post Content</Form.Label> 
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={postContent} 
                                onChange={(e) => setPostContent(e.target.value)} 
                                required 
                            /> 
                        </Form.Group> 
                        <Button variant="primary" type="submit"> 
                            Create Post 
                        </Button> 
                    </Form> 
                </Col> 
                <Col xs={12} md={8} style={{ padding: "1rem" }}> 
                    <hr /> 
                    {messages.length > 0 ? ( 
                        <Row> 
                            {messages.map((message) => ( 
                                <Col key={message.id} xs={12} md={6} lg={4} className="mb-4"> 
                                    <BadgerMessage 
                                        title={message.title} 
                                        poster={message.poster} 
                                        content={message.content} 
                                        created={message.created}
                                        id = {message.id} 
                                        onDelete={handleDeletePost} 
                                        showDelete={loginStatus && message.poster === username} 
                                    /> 
                                </Col> 
                            ))} 
                        </Row> 
                    ) : ( 
                        <p>There are no messages on this page yet!</p> 
                    )} 
                    <hr /> 
                    <Pagination> 
                        {paginationItems} 
                    </Pagination> 
                </Col> 
            </Row> 
        </Container> 
    ); 
}
