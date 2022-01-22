import './Comment.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function CommentBox(props) {

    const { loggedIn, user } = props;
    const { id } = useParams();
    const [comment, setComment] = useState('');

    const handleChange = (event) => {
        setComment(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const api = `http://localhost:8000/api/posts/${id}/comments/`
        
        const newComment = {
            user: user.id,
            post: id,
            content: comment
        }

        const request = await fetch(api,
            {
                method: 'post',
                body: JSON.stringify(newComment)
            })

        const response = request.json();
        console.log(response)

    }

    return (
        <div className="comment-box">
            {!loggedIn && <span className="grey">Log in or signup to leave a comment</span>}
            {loggedIn && 
                <form onSubmit={handleSubmit}>
                    <textarea name="comment" className="medium-font comment-area" placeholder="Leave a comment" onChange={handleChange}>
                    </textarea>
                    <button className="bg-dark-green white btn submit-comment-btn" type="submit" disabled={comment.length === 0}>Comment</button>
                </form>
            }
        </div>
    )
}

export default CommentBox;