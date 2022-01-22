import './Comment.css';
import { useState } from 'react';

function CommentBox(props) {

    const { loggedIn } = props;
    const [comment, setComment] = useState('');

    const handleChange = (event) => {
        setComment(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(comment);
    }

    return (
        <div className="comment-box">
            {!loggedIn && <span className="grey">Log in or signup to leave a comment</span>}
            {loggedIn && 
                <form onSubmit={handleSubmit}>
                    <textarea name="comment" className="medium-font comment-area" placeholder="Leave a comment" onChange={handleChange}>
                    </textarea>
                    <button className="btn" type="submit" disabled={comment.length == 0}>Comment</button>
                </form>
            }
        </div>
    )
}

export default CommentBox;