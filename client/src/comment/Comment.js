import './Comment.css';
import Vote from '../vote/Vote';
import { useState } from 'react';
import { getTimeElapsed } from '../util/helpers';

function Comment(props) {

    const { id, user, content, date } = props.comment
    const [votes, setVotes] = useState(props.comment.votes);

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
                    <Vote id={id} user={user} votes={votes} setVotes={setVotes}/>
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