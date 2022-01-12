import './Header.css';
import { useState } from 'react';

function Header(props) {

    const { setFormType, toggleForm } = props
    const [loggedIn, setLoggedIn] = useState(false);
    
    const handleClick = (formType) => {
        setFormType(formType);
        toggleForm();
    }

    return (
        <header className="bg-light-black header flex flex-jc-sb flex-ai-c">
            <a className="home flex flex-ai-c" href="/">
                <img alt="panda" src="/panda.png" className="logo"></img>
                <img alt="bamboo" src="/bamboo.png" className="brand"></img>
            </a>
            <div className="flex flex-ai-c">
            {!loggedIn && <button className="bg-white dark-green header-btn" onClick={() => handleClick('Login')}>Log In</button>}
            {!loggedIn && <button className="bg-dark-green white header-btn" onClick={() => handleClick('Sign Up')}>Sign Up</button>}
                <button className="profile">
                    <span className="white material-icons-outlined">person</span>
                </button>
            </div>
        </header>
    )
}

export default Header;