import './Header.css';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Header(props) {

    const { loggedIn, setLoggedIn, setFormType, toggleForm, user, setUser } = props
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

    const handleClick = (formType) => {
        setFormType(formType);
        toggleForm();
    }

    const toggleMenu = () => {
        menu ? setMenu(false) : setMenu(true);
    }

    const handleLogout = () => {
        setLoggedIn(false);
        localStorage.removeItem('token');
        setUser();
        toggleMenu();
        navigate('/');
    }

    return (
        <>
        <header className="bg-light-black header flex flex-jc-sb flex-ai-c">
            <a className="home flex flex-ai-c" href="/">
                <img alt="panda" src="/panda.png" className="logo"></img>
                <img alt="bamboo" src="/bamboo.png" className="brand"></img>
            </a>
            <div className="flex flex-ai-c">
                {!loggedIn && <button className="bg-white dark-green header-btn" onClick={() => handleClick('Login')}>Log In</button>}
                {!loggedIn && <button className="bg-dark-green white header-btn" onClick={() => handleClick('Sign Up')}>Sign Up</button>}
                {loggedIn && <a href="/profile" className="white name">{user.firstName} {user.lastName}</a>}
                <button className="profile-icon" onClick={toggleMenu} disabled={!loggedIn}>
                    <span className="white material-icons-outlined">person</span>
                </button>
            </div>
        </header>
        {menu && loggedIn && <div className="bg-light-black profile-menu flex flex-col flex-jc-c">
            <a href="/profile" className="white profile-menu-btn flex flex-row flex-ai-c">
                <span className="white material-icons-outlined">account_circle</span>
                <span className="small-font">Profile</span>
            </a>
            <button className="white profile-menu-btn flex flex-row flex-ai-c" onClick={handleLogout}>
                <span className="white material-icons-outlined">logout</span>
                <span className="small-font">Log Out</span>
            </button>
        </div>}
        </>
    )
}

export default Header;