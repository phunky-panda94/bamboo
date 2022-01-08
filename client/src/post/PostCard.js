import './PostCard.css';

function PostCard(props) {

    const { author, content, date, slug, title, votes } = props.details;

    return (
        <Link to={`/posts/${slug}`}>
            <div className="bg-white post-card flex">
                <div className="bg-light-grey post-votes flex flex-col flex-ai-c">
                    <button className="vote-btn material-icons-outlined">thumb_up</button>
                    <span>{votes}</span>
                    <button className="vote-btn material-icons-outlined">thumb_down</button>
                </div>
                <div className="post-content flex flex-col flex-jc-sb">
                    <div className="post-details">
                        <div className="dark-grey flex flex-jc-sb">
                            <span>Posted by <a className="author" href="/">{author}</a></span>
                            <span>{date}</span>
                        </div>
                        <h3>{title}</h3>
                        <p>{content}</p>
                    </div>
                    <div className="flex flex-row">
                        <button className="post-btn flex flex-row flex-ai-c" href="/">
                            <span>Comment</span>
                            <span className="material-icons-outlined">comment</span>
                        </button>
                        <button className="post-btn flex flex-row flex-ai-c" href="/">
                            <span>Share</span>
                            <span className="material-icons-outlined">share</span>
                        </button>
                        <button className="post-btn flex flex-row flex-ai-c" href="/">
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