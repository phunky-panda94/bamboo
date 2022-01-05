import './Feed.css';
import Post from '../post/Post';

function Feed() {
    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
        </div>
    )
}

export default Feed;
