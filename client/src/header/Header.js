import './Header.css';

function Navbar() {
    return (
        <header className="bg-light-black navbar flex flex-jc-sb flex-ai-c">
            <a className="flex flex-ai-c" href="/">
                <img alt="panda" src="/logo.png" className="logo"></img>
            </a>
            <div className="flex flex-ai-c">
                <button className="bg-white dark-green navbar-btn">Log In</button>
                <button className="bg-dark-green white navbar-btn">Sign Up</button>
                <button className="profile">
                    <span className="white material-icons-outlined">person</span>
                </button>
            </div>
        </header>
    )
}

export default Navbar;