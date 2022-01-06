import './Feed.css';
import PostCard from '../post/PostCard';

function Feed() {
    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                <PostCard/>
                <PostCard/>
                <PostCard/>
            </div>
        </div>
    )
}

export default Feed;
