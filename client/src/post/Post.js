import './Post.css';
import { getTimeElapsed } from '../util/helpers';
import CommentBox from '../comment/CommentBox';
import { useEffect, useState } from 'react';

function Post(props) {

    const { id, author, content, date, title } = props.post;
    const { setComments, loggedIn, token, user, votes, setVotes } = props;
    const [vote, setVote] = useState(null);

    const handleClick = async (down) => {

        const api = "http://localhost:8000/api/votes/";

        const vote = {
            user: user._id,
            content: id,
            down: down
        }

        const response = await fetch(api, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vote)
        })
        
        if (response.status === 201) {
            setVotes(votes + 1);
        }

    }

    useEffect(() => {
        async function checkVote() {
            let api = `http://localhost:8000/api/votes/post/${id}`;
            const response = await fetch(api, { 
                mode: 'cors',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const down = await response.json();
            setVote(down);
        }
        checkVote();
    }, [token, votes, id])
    
    return (
        <div className="post-container flex flex-col flex-ai-c">
            <div className="bg-white post flex">
                <div className="post-votes flex flex-col flex-ai-c">
                    {vote === null ?
                        <>
                        <button className="vote-btn material-icons-outlined" onClick={() => handleClick(false)}>thumb_up</button>
                        {votes}
                        <button className="vote-btn material-icons-outlined" onClick={() => handleClick(true)}>thumb_down</button>
                        </>
                    :
                        <>
                        <button className={vote ? "vote-btn material-icons-outlined" : "voted vote-btn material-icons-outlined"} onClick={() => handleClick(false)}>thumb_up</button>
                        {votes}
                        <button className={vote ? "voted vote-btn material-icons-outlined" : "vote-btn material-icons-outlined"} onClick={() => handleClick(true)}>thumb_down</button>
                        </>
                    }
                </div>
                <div className="post-content flex flex-col flex-jc-sb">
                    <div className="post-details">
                        <div className="dark-grey flex flex-jc-sb">
                            <span>Posted by <a className="author" href="/">
                                {author}</a>
                            </span>
                            <span>{getTimeElapsed(date, Date.now())}</span>
                        </div>
                        <h3>{title}</h3>
                        <p>{content}</p>
                    </div>
                    <div className="flex flex-row">
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span>Comments</span>
                            <span className="material-icons-outlined">comment</span>
                        </a>
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span>Share</span>
                            <span className="material-icons-outlined">share</span>
                        </a>
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span>Save</span>
                            <span className="material-icons-outlined">bookmark_border</span>
                        </a>
                    </div>
                    <CommentBox setComments={setComments} user={user} loggedIn={loggedIn}/>
                    <hr className="line"></hr>
                </div>
            </div>
        </div>
    )
}

export default Post;