import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                </ul>
            </div>
            <div>
                <Link to="/profile">
                    <img></img>
                </Link>
                <Link to="/">Logout</Link>
            </div>
        </div>
    )
}

export default Navbar;