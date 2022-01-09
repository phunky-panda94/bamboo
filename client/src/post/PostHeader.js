import './PostCard.css';
import './PostHeader.css';

function PostHeader(props) {

    const { title, votes } = props;

    return (
        <div className="bg-light-grey post-header flex flex-jc-sb flex-ai-c">
            <div className="bg-light-grey flex flex-row flex-ai-c">
                <button className="vote-btn material-icons-outlined">thumb_up</button>
                {votes}
                <button className="vote-btn material-icons-outlined">thumb_down</button>
            </div>
            <h3>{title}</h3>
            <div className="post-header-close flex flex-ai-c">
                <a href="/">&times;</a>
            </div>
        </div>
    )
}

export default PostHeader;