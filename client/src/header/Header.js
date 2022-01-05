import './Header.css';

function Navbar() {
    return (
        <header className="bg-light-black navbar flex flex-jc-sb flex-ai-c">
            <a className="home flex flex-ai-c" href="/">
                <img alt="panda" src="/panda.png" className="logo"></img>
                <img alt="bamboo" src="/bamboo.png" className="brand"></img>
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