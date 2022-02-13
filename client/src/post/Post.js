import './Post.css';
import { getTimeElapsed } from '../util/helpers';
import CommentBox from '../comment/CommentBox';
import Vote from '../vote/Vote';
import { useState } from 'react';

function Post(props) {

    const { id, author, date } = props.post;
    const { setComments, loggedIn, user, votes, setVotes } = props;

    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState(props.post.title);
    const [content, setContent] = useState(props.post.content);
    
    const handleClick = () => {
        if (edit) {
            if (title !== props.post.title || content !== props.post.content) {
                updatePost();
            }
            setEdit(false)
        } else {
            setEdit(true);
        }
    }

    const handleChange = (event) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'content':
                setContent(event.target.value);
                break;
            default:
        }
    }

    const updatePost = async () => {
        let api = `http://localhost:8000/api/posts/${id}`;
        const token = localStorage.getItem('token');

        const updatedPost = {
            content: content,
            title: title
        }

        await fetch(api, {
            method: 'put',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost)
        })
    }

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
                                {author === `${user.firstName} ${user.lastName}` ? 'you' : author}
                                </a>
                            </span>
                            <span>{getTimeElapsed(date, Date.now())}</span>
                        </div>
                        <div className="flex flex-row flex-ai-c flex-jc-sb">
                            {edit ? <input name="title" className="field title" type="text" required={true} value={title} onChange={handleChange}/> : <h3>{title}</h3>}
                            {author === `${user.firstName} ${user.lastName}` && 
                            <button className={`${edit ? 'on' : ''} edit-btn material-icons-outlined`} onClick={handleClick}>
                                edit
                            </button>
                            }
                        </div>
                        <div className={edit ? "comment-box" : ""}>
                            {edit ? <textarea name="content" className="medium-font text-area" value={content} onChange={handleChange} /> : <p>{content}</p>}
                        </div>
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