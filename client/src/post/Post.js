import './Post.css';
import { getTimeElapsed } from '../util/helpers';
import CommentBox from '../comment/CommentBox';
import Vote from '../vote/Vote';

function Post(props) {

    const { id, author, content, date, title } = props.post;
    const { setComments, loggedIn, user, votes, setVotes } = props;
    
    return (
        <div className="post-container flex flex-col flex-ai-c">
            <div className="bg-white post flex">
                <div className="post-votes flex flex-col flex-ai-c">
                    <Vote id={id} user={user} votes={votes} setVotes={setVotes}/>
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