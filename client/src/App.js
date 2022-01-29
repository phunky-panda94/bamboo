import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';
import Form from './form/Form';
import Thread from './thread/Thread';
import NewPost from './post/NewPost';
import Profile from './profile/Profile';

function App() {

    const [displayForm, setDisplayForm] = useState(false);
    const [formType, setFormType] = useState();
    const [posts, setPosts] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState();
    const [title, setTitle] = useState('');
    const token = localStorage.getItem('token');

    const toggleForm = () => {
        displayForm ? setDisplayForm(false) : setDisplayForm(true);
    }

    useEffect(() => {
        async function fetchPosts() {
            let api = "http://localhost:8000/api/posts";
        
            const response = await fetch(api, { mode: 'cors' });
            const data = await response.json();
            setPosts(data);
        }
        fetchPosts();
        
        async function fetchUser() {
            let api = "http://localhost:8000/api/user";

            const response = await fetch(api, { 
                headers: { authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setUser(data);
            setLoggedIn(true);
        }

        if (token) {
            fetchUser();
        }
    }, [token])

    return (
        <Router>
            <Header setFormType={setFormType} toggleForm={toggleForm} loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser}/>
            {displayForm && <Form type={formType} setLoggedIn={setLoggedIn} toggleForm={toggleForm} setUser={setUser}/>}
            <Routes>
                <Route path="/" element={<Feed loggedIn={loggedIn} title={title} setTitle={setTitle} posts={posts}/>} />
                <Route path="/profile" element={<Profile user={user}/>} />
                <Route path="/create-post" element={<NewPost setPosts={setPosts} title={title} setTitle={setTitle} user={user}/>} />
                <Route path="/posts/:id" element={<Thread user={user} loggedIn={loggedIn}/>} />
            </Routes>
        </Router>
    );
}

export default App;
