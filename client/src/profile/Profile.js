import env from 'react-dotenv';
import './Profile.css';
import PostCard from '../post/PostCard';
import { useState, useEffect } from 'react';

function Profile(props) {
    
    const { user } = props;
    const [userPosts, setUserPosts] = useState();
    
    useEffect(() => {
        async function fetchUserPosts() {
            let api = `${env.SERVER}/user/${user._id}/posts`
            const response = await fetch(api, { mode: 'cors' });
            const data = await response.json();
            setUserPosts(data);
        }
        fetchUserPosts();
    }, [user])

    return (
        <div className="profile flex flex-jc-c">
            {user && userPosts && <div className="profile-container flex flex-jc-sb">
                <div className="user-posts flex flex-col">
                    {userPosts.map(post => {
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
                <div className="bg-white profile-card flex flex-col flex-jc-c">
                    <img src="/panda.png" className="logo" alt="avatar image"></img>
                    <table>
                        <tr>
                            <td><b>Name:</b></td>
                            <td>{user.firstName} {user.lastName}</td>
                        </tr>
                        <tr>
                            <td><b>Email:</b></td>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <td><b>No. of posts:</b></td>
                            <td>{userPosts.length}</td>
                        </tr>
                    </table>
                </div>
            </div>}
        </div>
    )
}

export default Profile;