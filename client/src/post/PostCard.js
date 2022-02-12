import './PostCard.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTimeElapsed } from '../util/helpers';
import Vote from '../vote/Vote';

function PostCard(props) {

    const { id, author, content, date, title } = props.post;
    const { user } = props;
    const [votes, setVotes] = useState(props.post.votes);
    const navigate = useNavigate();

    const handleClick = (event) => {
        if (event.target.tagName === 'DIV') {
            navigate(`/posts/${id}`);
        }
    }

    return (
        <div className="bg-white post-card flex" onClick={handleClick}>
            <div className="bg-light-grey post-votes flex flex-col flex-ai-c">
                <Vote id={id} user={user} votes={votes} setVotes={setVotes}/> 
            </div>
            <div className="post-content flex flex-col flex-jc-sb">
                <div className="post-details">
                    <div className="dark-grey flex flex-jc-sb">
                        <span>Posted by <Link to="" className="author">
                            {author === `${user.firstName} ${user.lastName}` ? 'you' : author}
                            </Link>
                        </span>
                        <span>{getTimeElapsed(date, Date.now())}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{content}</p>
                </div>
                <div className="flex flex-row">
                    <Link to={`/posts/${id}`} className="post-btn flex flex-row flex-ai-c">
                        <span>Comments</span>
                        <span className="material-icons-outlined">comment</span>
                    </Link>
                    <Link to="" className="post-btn flex flex-row flex-ai-c">
                        <span>Share</span>
                        <span className="material-icons-outlined">share</span>
                    </Link>
                    <button className="post-btn flex flex-row flex-ai-c">
                        <span>Save</span>
                        <span className="material-icons-outlined">bookmark_border</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostCard;