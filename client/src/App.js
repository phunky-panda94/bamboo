import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';

function App() {
    return (
        <Router>
            <Header/>
            <Feed/>
            {/* <Routes>
                <Route exact path="/" />
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes> */}
        </Router>
    );
}

export default App;
