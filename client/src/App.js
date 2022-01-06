import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';
import Form from './form/Form';
import Post from './post/Post';

function App() {
    return (
        <Router>
            <Header/>
            <Post />
            {/* <Routes>
                <Route exact path="/">
                    <Form type="Register"/>
                    <Feed/>
                <Route/>
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes> */}
        </Router>
    );
}

export default App;
