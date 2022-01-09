import './Comment.css';

function Comment(props) {

    const { user, content, date, votes } = props.comment

    return (
        <div className="bg-white comment-container flex flex-row flex-jc-c">
            <div className="user-avatar">
                <img alt=""></img>
            </div>
            <div className="bg-white comment">
                <div className="dark-grey flex flex-jc-sb">
                    <span>{user}</span>
                    <span>{date}</span>
                </div>
                <div>
                    <p>{content}</p>
                </div>
                <div className="flex flex-ai-c">
                    <button className="vote-btn material-icons-outlined">thumb_up</button>
                    <span>{votes}</span>
                    <button className="vote-btn material-icons-outlined">thumb_down</button>
                    <button className="comment-btn">Reply</button>
                    <button className="comment-btn">Share</button>
                    <button className="comment-btn">Save</button>
                    <button className="comment-btn">Follow</button>
                </div>
            </div>
        </div>
    )
}

export default Comment;