import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route exact path="/" />
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes>
        </Router>
    );
}

export default App;
