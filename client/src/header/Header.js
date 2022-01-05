import './Header.css';

function Header() {
    return (
        <header className="bg-light-black header flex flex-jc-sb flex-ai-c">
            <a className="home flex flex-ai-c" href="/">
                <img alt="panda" src="/panda.png" className="logo"></img>
                <img alt="bamboo" src="/bamboo.png" className="brand"></img>
            </a>
            <div className="flex flex-ai-c">
                <button className="bg-white dark-green header-btn">Log In</button>
                <button className="bg-dark-green white header-btn">Sign Up</button>
                <button className="profile">
                    <span className="white material-icons-outlined">person</span>
                </button>
            </div>
        </header>
    )
}

export default Header;