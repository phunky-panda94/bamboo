import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';
import Form from './form/Form';
import Thread from './thread/Thread';

function App() {

    const [displayForm, setDisplayForm] = useState(false);
    const [formType, setFormType] = useState();
    const [posts, setPosts] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState();
    const token = localStorage.getItem('token');

    const toggleForm = () => {
        displayForm ? setDisplayForm(false) : setDisplayForm(true);
    }

    useEffect(() => {
        async function fetchPosts() {
            let api = "http://localhost:8000/api/posts";
        
            const response = await fetch(api, { mode: 'cors' });
            const posts = await response.json();
            setPosts(posts);
        }
        fetchPosts();

        async function login() {
            let api = "http://localhost:8000/api/user";

            const response = await fetch(api, { 
                headers: { authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setUser(data);
            setLoggedIn(true);
        }

        if (token) {
            login();
        }

    }, [])

    return (
        <Router>
            <Header setFormType={setFormType} toggleForm={toggleForm} loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser}/>
            {displayForm && <Form type={formType} setLoggedIn={setLoggedIn} toggleForm={toggleForm} setUser={setUser}/>}
            <Routes>
                <Route path="/" element={<Feed posts={posts}/>} />
                <Route path="/posts/:id" element={<Thread user={user} loggedIn={loggedIn}/>} />
            </Routes>
        </Router>
    );
}

export default App;
