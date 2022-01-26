import './Profile.css';
import PostCard from '../post/PostCard';
import { useState, useEffect } from 'react';

function Profile(props) {
    
    const { user } = props;
    const [posts, setPosts] = useState();

    useEffect(() => {
        async function fetchUserPosts() {
            const api = `http://localhost:8000/api/user/${user._id}/posts`;

            const response = await fetch(api, { mode: 'cors' });
            const data = response.json();
            setPosts(data);
        }
        fetchUserPosts();
    }, [user._id])

    return (
        <div className="profile">
            <div className="user-posts flex flex-col">
                {posts && posts.map(post => {
                    let details = {
                        id: post._id,
                        author: `${post.author.firstName} ${post.author.lastName}`,
                        content: post.content,
                        date: post.date,
                        title: post.title,
                        votes: post.votes
                    }
                    return <PostCard key={post._id} post={details}/>
                })}
            </div>
            <div className="bg-white profile-details flex flex-col">
                {/* <span>Name: {}</span>
                <span>Email: {user.email}</span> */}
                <span>Number of posts: {posts.length}</span>
            </div>
        </div>
    )
}

export default Profile;