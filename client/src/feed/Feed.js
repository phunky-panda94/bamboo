import './Feed.css';
import PostCard from '../post/PostCard';

function Feed(props) {

    const { posts } = props;

    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                {posts && posts.map(post => {

                    let details = {
                        id: post._id,
                        author: `${post.author.firstName} ${post.author.lastName}`,
                        content: post.content,
                        date: post.date,
                        title: post.title,
                        votes: post.votes
                    }

                    return <PostCard key={post._id} post={details}/>
                })}
            </div>
        </div>
    )
}

export default Feed;
