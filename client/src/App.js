import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Post from './post/Post';

function App() {
    return (
        <Router>
            <Header/>
            <Post/>
            {/* <Routes>
                <Route exact path="/" />
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes> */}
        </Router>
    );
}

export default App;
