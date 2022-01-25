import './Profile.css';
import PostCard from '../post/PostCard';
import { useState, useEffect } from 'react';

function Profile(props) {

    const { user } = props;
    const [posts, setPosts] = useState();

    useEffect(() => {
        async function fetchUserPosts() {
            const api = `http://localhost:8000/user/${user._id}`;

            const response = await fetch(api, { mode: 'cors' });
            const data = response.json();

            

        }
    })

    return (
        <div className="profile">
            <div>
                {}
            </div>
            <div className="profile-details"></div>
        </div>
    )
}

export default Profile;