import './Feed.css';
import PostCard from '../post/PostCard';

function Feed(props) {

    const { posts } = props;

    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                {posts && posts.map(post => {

                    let details = {
                        author: `${post.author.firstName} ${post.author.lastName}`,
                        content: post.content,
                        date: post.date,
                        slug: post.slug,
                        title: post.title,
                        votes: post.votes,
                        url: post.url
                    }

                    return <PostCard key={post._id} post={details}/>
                })}
            </div>
        </div>
    )
}

export default Feed;
