import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';
import Form from './form/Form';

function App() {
    return (
        <Router>
            <Header/>
            <Form />
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
