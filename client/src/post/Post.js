import './Post.css';

function Post() {
    return (
        <div className="border bg-white post flex">
            <div className="bg-light-grey post-votes flex flex-col flex-ai-c">
                <button className="vote-btn material-icons-outlined">thumb_up</button>
                12
                <button className="vote-btn material-icons-outlined">thumb_down</button>
            </div>
            <div className="post-content flex flex-col">
                <div className="post-details flex flex-jc-sb">
                    <span>Posted by Author</span>
                    <span>Time elapsed</span>
                </div>
                <h3>Title</h3>
                <p>This is a post</p>
                <div className="post-btns">
                    <a className="material-icons-outlined">comment</a>
                    <a className="material-icons-outlined">share</a>
                    <a className="material-icons-outlined">bookmark_border</a>
                </div>
            </div>
        </div>
    )
}

export default Post;