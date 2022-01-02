import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './navbar/Navbar';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route exact path="/" />
                <Route path="/posts" />
                <Route path="/profile"/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
