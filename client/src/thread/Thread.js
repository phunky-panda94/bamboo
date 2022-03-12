import env from 'react-dotenv';
import './Thread.css';
import Post from '../post/Post';
import PostHeader from '../post/PostHeader';
import Comment from '../comment/Comment';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Thread(props) {

    const { setPosts, token, user, loggedIn, setFormType, toggleForm } = props;
    const { id } = useParams();
    const [post, setPost] = useState();
    const [votes, setVotes] = useState();
    const [comments, setComments] = useState();
    
    useEffect(() => {
        async function fetchPost() {
            let api = `${env.SERVER}/posts/${id}`;
            
            const response = await fetch(api, { mode: 'cors' });
            const data = await response.json();
            
            let post = {
                id: data._id,
                author: `${data.author.firstName} ${data.author.lastName}`,
                content: data.content,
                date: data.date,
                title: data.title,
                votes: data.votes,
                comments: data.comments
            }

            setPost(post);
            setVotes(post.votes);
        }

        async function fetchComments() {
            let api = `${env.SERVER}/posts/${id}/comments`;

            const response = await fetch(api, { mode: 'cors' });
            const comments = await response.json();
            setComments(comments); 
        }

        fetchPost();
        fetchComments();
        
    },[id])
    
    return (
        <div className="post-container flex flex-col flex-ai-c">
            {post && <PostHeader title={post.title} votes={votes} setVotes={setVotes}/>}
            {post && <Post 
                token={token} 
                user={user} 
                loggedIn={loggedIn} 
                post={post} 
                votes={votes} 
                setVotes={setVotes} 
                setPosts={setPosts} 
                setComments={setComments}
                setFormType={setFormType}
                toggleForm={toggleForm} 
            />}
            {comments && comments.map(comment => {
                let postUser;
                let commentUser = `${comment.user.firstName} ${comment.user.lastName}`;

                if (user) {
                    postUser = `${user.firstName} ${user.lastName}`;
                }

                let fullName;
                postUser && postUser === commentUser ? fullName = 'You' : fullName = commentUser;

                let details = {
                    id: comment._id,
                    user: fullName,
                    post: comment.post,
                    content: comment.content,
                    date: comment.date,
                    votes: comment.votes
                }
                return <Comment key={comment._id} comment={details} setComments={setComments} user={user} setFormType={setFormType}
                toggleForm={toggleForm}/>
            })}
        </div>
    )
}

export default Thread;