import './Post.css';
import PostHeader from './PostHeader';
import PostCard from './PostCard';

function Post() {
    return (
        <div className="post flex flex-col flex-jc-c flex-ai-c">
            <PostHeader />
            <PostCard />
        </div>
    )
}

export default Post;