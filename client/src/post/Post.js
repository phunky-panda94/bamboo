import env from 'react-dotenv';
import './Post.css';
import { getTimeElapsed } from '../util/helpers';
import CommentBox from '../comment/CommentBox';
import Vote from '../vote/Vote';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Post(props) {

    const { id, author, date } = props.post;
    const { comments, setComments, setPosts, loggedIn, user, votes, setVotes, setFormType, toggleForm } = props;
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState(props.post.title);
    const [content, setContent] = useState(props.post.content);
    
    const handleEdit = () => {
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
        let api = `${env.SERVER}/posts/${id}`;
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

    const deletePost = async () => {
        let api = `${env.SERVER}/posts/${id}`;
        const token = localStorage.getItem('token');
        await fetch(api, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        api = `${env.SERVER}/posts`;
        const response = await fetch(api, { mode: 'cors' });
        const posts = await response.json();
        setPosts(posts);
        navigate('/');
    }

    return (
        <div className="post-container flex flex-col flex-ai-c">
            <div className="bg-white post flex">
                <div className="post-votes flex flex-col flex-ai-c">
                    <Vote id={id} user={user} votes={votes} setVotes={setVotes} setFormType={setFormType}
                toggleForm={toggleForm}/>
                </div>
                <div className="post-content flex flex-col flex-jc-sb">
                    <div className="post-details">
                        <div className="dark-grey flex flex-jc-sb">
                            <span>Posted by <a className="author" href="/">
                                {user && author === `${user.firstName} ${user.lastName}` ? 'you' : author}
                                </a>
                            </span>
                            <span>{getTimeElapsed(date, Date.now())}</span>
                        </div>
                        <div className="flex flex-row flex-ai-c flex-jc-sb">
                            {edit ? <input name="title" className="field title" type="text" required={true} value={title} onChange={handleChange}/> : <h3>{title}</h3>}
                            {user && author === `${user.firstName} ${user.lastName}` && 
                            <div>
                            <button className={`${edit ? 'on' : ''} modify-btn material-icons-outlined`} onClick={handleEdit}>
                                edit
                            </button>
                            <button className="modify-btn material-icons-outlined" onClick={() => deletePost()}>
                                delete
                            </button>
                            </div>
                            }
                        </div>
                        <div className={edit ? "comment-box" : ""}>
                            {edit ? <textarea name="content" className="medium-font text-area" value={content} onChange={handleChange} /> : <p>{content}</p>}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span className="material-icons-outlined">comment</span>
                            {comments > 0 && <span>{comments}</span>}
                            <span>Comments</span>
                        </a>
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span className="material-icons-outlined">share</span>
                            <span>Share</span>
                        </a>
                        <a className="post-btn flex flex-row flex-ai-c" href="/">
                            <span className="material-icons-outlined">bookmark_border</span>
                            <span>Save</span>
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