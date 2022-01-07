import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header/Header';
import Feed from './feed/Feed';
import Form from './form/Form';
import Post from './post/Post';

function App() {

    const [displayForm, setDisplayForm] = useState(false);
    const [formType, setFormType] = useState();

    const toggleForm = () => {
        displayForm ? setDisplayForm(false) : setDisplayForm(true);
    }

    return (
        <Router>
            <Header setFormType={setFormType} toggleForm={toggleForm} />
            {displayForm && <Form type={formType} toggleForm={toggleForm}/>}
            <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/post/:id" element={<Post />} />
            </Routes>
        </Router>
    );
}

export default App;
