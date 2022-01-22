import './Comment.css';
import { getTimeElapsed } from '../util/helpers';

function Comment(props) {

    const { user, content, date, votes } = props.comment

    return (
        <div className="bg-white comment-container flex flex-row flex-jc-c">
            <div className="user-avatar flex flex-jc-c">
                <img alt="" src="/panda.png" className="user-avatar-dp"></img>
            </div>
            <div className="bg-white comment">
                <div className="dark-grey flex flex-jc-sb">
                    <a href="#" className="user">{user}</a>
                    <span>{getTimeElapsed(date, Date.now())}</span>
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