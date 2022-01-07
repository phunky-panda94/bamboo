import './Feed.css';
import PostCard from '../post/PostCard';

function Feed(props) {

    const { posts } = props;

    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                {posts && posts.map(post => {
                    return <PostCard content={post.content} author={`${post.author.firstName} ${post.author.lastName}`} date={post.date}/>
                })}
            </div>
        </div>
    )
}

export default Feed;
