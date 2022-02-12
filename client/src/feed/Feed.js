import './Feed.css';
import PostCard from '../post/PostCard';
import NewPostBox from '../post/NewPostBox';

function Feed(props) {

    const { loggedIn, posts, title, setTitle, user } = props;

    return (
        <div className="flex flex-jc-c">
            <div className="feed flex flex-col flex-ai-c">
                {loggedIn && <NewPostBox title={title} setTitle={setTitle}/>}
                {posts && posts.map(post => {

                    let details = {
                        id: post._id,
                        author: `${post.author.firstName} ${post.author.lastName}`,
                        content: post.content,
                        date: post.date,
                        title: post.title,
                        votes: post.votes
                    }

                    return <PostCard key={post._id} post={details} user={user}/>
                })}
            </div>
        </div>
    )
}

export default Feed;
