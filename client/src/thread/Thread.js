import './Thread.css';
import Post from '../post/Post';
import PostHeader from '../post/PostHeader';
import Comment from '../comment/Comment';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Thread(props) {

    const { user, loggedIn } = props;
    const { id } = useParams();
    const [post, setPost] = useState();
    const [comments, setComments] = useState();
    
    useEffect(() => {
        async function fetchPost() {
            let api = `http://localhost:8000/api/posts/${id}`;
            
            const response = await fetch(api, { mode: 'cors' });
            const data = await response.json();
            
            let post = {
                author: `${data.author.firstName} ${data.author.lastName}`,
                content: data.content,
                date: data.date,
                title: data.title,
                votes: data.votes
            }
            
            setPost(post);
        }
        fetchPost();

        async function fetchComments() {
            let api = `http://localhost:8000/api/posts/${id}/comments`;

            const response = await fetch(api, { mode: 'cors' });
            const comments = await response.json();
            setComments(comments); 
        }
        fetchComments();
        
    },[id, comments])
    
    return (
        <div className="post-container flex flex-col flex-ai-c">
            {post && <PostHeader title={post.title} votes={post.votes}/>}
            {post && <Post user={user} loggedIn={loggedIn} post={post} comments={comments} setComments={setComments}/>}
            {comments && comments.map(comment => {
                let details = {
                    user: `${comment.user.firstName} ${comment.user.lastName}`,
                    content: comment.content,
                    date: comment.date,
                    votes: comment.votes
                }
                return <Comment key={comment._id} comment={details}/>
            })}
        </div>
    )
}

export default Thread;