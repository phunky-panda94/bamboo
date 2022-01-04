import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" />
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes>
        </Router>
    );
}

export default App;
