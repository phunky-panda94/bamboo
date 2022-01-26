import './Comment.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function CommentBox(props) {

    const { setComments, loggedIn, user } = props;
    const { id } = useParams();
    const [comment, setComment] = useState('');

    const handleChange = (event) => {
        setComment(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const api = `http://localhost:8000/api/posts/${id}/comments/`
        
        const token = localStorage.getItem('token');

        const newComment = {
            user: user._id,
            content: comment
        }

        const details = {
            method: 'post',
            headers: { 
                Accept: 'application/json',
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        }

        const response = await fetch(api, details);

        if (response.status === 201) {
            setComment('');
            let api = `http://localhost:8000/api/posts/${id}/comments`;

            const response = await fetch(api, { mode: 'cors' });
            const comments = await response.json();
            setComments(comments); 
        }

    }

    return (
        <div className="comment-box">
            {!loggedIn && <span className="grey">Log in or signup to leave a comment</span>}
            {loggedIn && 
                <form onSubmit={handleSubmit}>
                    <textarea className="medium-font text-area" placeholder="Leave a comment" value={comment} onChange={handleChange} />
                    <button className="bg-dark-green white btn submit-btn" type="submit" disabled={comment.length === 0}>Comment</button>
                </form>
            }
        </div>
    )
}

export default CommentBox;