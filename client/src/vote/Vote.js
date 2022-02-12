import { useCallback, useEffect, useState } from 'react';
import './Vote.css';

function Vote(props) {

    const { id, user, votes, setVotes } = props;
    const [vote, setVote] = useState(null);
    const token = localStorage.getItem('token')

    const getVote = useCallback(async () => {
        const api = `http://localhost:8000/api/votes/post/${id}`;
        const response = await fetch(api, { 
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            const data = await response.json();
            setVote(data);
        }
    }, [token, id])

    const createVote = async (down) => {
        let api = "http://localhost:8000/api/votes/";
        const vote = {
            user: user._id,
            content: id,
            down: down
        }
        const response = await fetch(api, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vote)
        })
        
        if (response.status === 201) {
            setVotes(votes + 1);
            await getVote();
        }
    }

    const updateVote = async (down) => {
        let api = `http://localhost:8000/api/votes/${vote._id}/${down}`;
        const response = await fetch(api, {
            method: 'put',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 204) {
            await getVote();
        }
    }

    const deleteVote = async () => {
        const api = `http://localhost:8000/api/votes/${vote._id}`;
        const response = await fetch(api, {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 202) {
            setVotes(votes - 1);
            setVote(null);
        }
    }

    useEffect(() => {
        getVote();
    }, [getVote])
    
    return (
        <>
        {vote === null ?
            <>
            <button className="vote-btn material-icons-outlined" onClick={() => createVote(false)}>thumb_up</button>
            {votes}
            <button className="vote-btn material-icons-outlined" onClick={() => createVote(true)}>thumb_down</button>
            </>
        :
            <>
            <button className={vote.down ? "vote-btn material-icons-outlined" : "voted vote-btn material-icons-outlined"} onClick={vote.down ? () => updateVote(false) : deleteVote}>thumb_up</button>
            {votes}
            <button className={vote.down ? "voted vote-btn material-icons-outlined" : "vote-btn material-icons-outlined"} onClick={vote.down ? deleteVote : () => updateVote(true)}>thumb_down</button>
            </>
        }
        </>
    )
}

export default Vote;