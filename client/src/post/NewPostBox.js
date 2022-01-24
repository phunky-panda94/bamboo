import './NewPostBox.css'
import { useNavigate } from 'react-router-dom';

function NewPostBox(props) {

    const { title, setTitle } = props;
    const navigate = useNavigate();

    const handleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/create-post');
    }

    return (
        <form className="bg-white new-post-box flex flex-ai-c" onSubmit={handleSubmit}>
            <img alt="panda" src="/panda.png" className="logo"></img>
            <input className="new-post-input" type="text" placeholder="Title" value={title} onChange={handleChange}/>
            <button className="bg-dark-green white new-post-btn" type="submit">Create Post</button>
        </form>
    )
}

export default NewPostBox;