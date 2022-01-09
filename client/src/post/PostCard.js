import './PostCard.css';
import { Link } from 'react-router-dom';

function PostCard(props) {

    const { id, author, content, date, title, votes } = props.post;

    return (
        <Link to={`/posts/${id}`}>
            <div className="bg-white post-card flex">
                <div className="bg-light-grey post-votes flex flex-col flex-ai-c">
                    <button className="vote-btn material-icons-outlined">thumb_up</button>
                    <span>{votes}</span>
                    <button className="vote-btn material-icons-outlined">thumb_down</button>
                </div>
                <div className="post-content flex flex-col flex-jc-sb">
                    <div className="post-details">
                        <div className="dark-grey flex flex-jc-sb">
                            <span>Posted by {author}</span>
                            <span>{date}</span>
                        </div>
                        <h3>{title}</h3>
                        <p>{content}</p>
                    </div>
                    <div className="flex flex-row">
                        <button className="post-btn flex flex-row flex-ai-c">
                            <span>Comment</span>
                            <span className="material-icons-outlined">comment</span>
                        </button>
                        <button className="post-btn flex flex-row flex-ai-c">
                            <span>Share</span>
                            <span className="material-icons-outlined">share</span>
                        </button>
                        <button className="post-btn flex flex-row flex-ai-c">
                            <span>Save</span>
                            <span className="material-icons-outlined">bookmark_border</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard;