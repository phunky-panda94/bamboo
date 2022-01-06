import './PostCard.css';
import './PostHeader.css';

function PostHeader() {
    return (
        <div className="bg-light-grey post-header flex flex-jc-sb flex-ai-c">
            <div className="bg-light-grey flex flex-row flex-ai-c">
                <button className="vote-btn material-icons-outlined">thumb_up</button>
                12
                <button className="vote-btn material-icons-outlined">thumb_down</button>
            </div>
            <h3>Title</h3>
            <div className="post-header-close flex flex-ai-c">
                <span>&times;</span>
            </div>
        </div>
    )
}

export default PostHeader;