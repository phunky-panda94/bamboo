import './Form.css';
import Field from './Field';
import { useState } from 'react';

function Form(props) {

    const { setLoggedIn, setUser, toggleForm, type } = props
    const [registered, setRegistered] = useState(false);
    const [errors, setErrors] = useState();
    const [error, setError] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        type === 'Login' ? await handleLogin(event) : await handleRegister(event);
    }

    const handleLogin = async (event) => {
        const api = 'http://localhost:8000/api/user/login';
        const details = {
            email: event.target.elements['email'].value,
            password: event.target.elements['password'].value
        }

        const response = await fetch(api, 
            {
                method: 'post',
                credentials: 'include',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(details)
            }
        );

        const data = await response.json();

        if (response.status !== 200) {
            setError(data.error);
        } else {
            setUser(data.user);
            setLoggedIn(true);
            toggleForm();
        }
        
    }

    const handleRegister = async (event) => { 
        const api = 'http://localhost:8000/api/user/register';
        const details = {
            firstName: event.target.elements['firstName'].value,
            lastName: event.target.elements['lastName'].value,
            email: event.target.elements['email'].value,
            password: event.target.elements['password'].value
        }

        const response = await fetch(api, 
            {
                method: 'post',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(details)
            }
        );

        if (response.status !== 201) {
            let data = await response.json();
            
            if (data.errors) {
                let errorTypes = {}
                data.errors.forEach(error => {
                    errorTypes[error.param] = error.msg;
                })
                setErrors(errorTypes);
            } else {
                setError(data.error)
            }
            
        } else {
            setRegistered(true);
            handleLogin(event);
        }
        
    }

    return (
        <div className="modal flex flex-jc-c flex-ai-c">
            <div className="bg-white form flex flex-row">
                <div>
                    <img className="banner" src="/tree.png" alt="banner"></img>
                </div>
                <div className="form-container flex flex-col">
                    <div className ="close flex flex-jc-fe">
                        <span className="grey close-btn" onClick={() => toggleForm()}>&times;</span>
                    </div>
                    <div className="form-container flex flex-jc-c flex-ai-c">
                        <form className="form-field-group flex flex-col" onSubmit={handleSubmit}>
                            <h3>{type}</h3>
                            {type === 'Sign Up' ?
                                <>
                                    <Field name="firstName" label="Given Name" required={true}/>
                                    {errors && errors.firstName && <span className="red small-font">{errors.firstName}</span>}
                                    <Field name="lastName" label="Surname" required={true}/>
                                    {errors && errors.lastName && <span className="red small-font">{errors.lastName}</span>}
                                    <Field name="email" type="text" label="Email" required={true}/>
                                    {errors && errors.email && <span className="red small-font">{errors.email}</span>}
                                    <Field name="password" type="password" label="Password" required={true}/>
                                    {errors && errors.password && <span className="red small-font">{errors.password}</span>}
                                    {error && <span className="red small-font">{error}</span>}
                                </>
                            :
                                <>
                                    <Field name="email" type="text" label="Email" required={true}/>
                                    <Field name="password" type="password" label="Password" required={true}/>
                                    {error && <span className="red small-font">{error}</span>}
                                </>
                            }
                            <button className="bg-dark-green white btn" type="submit">
                                {!registered && type}
                                {registered && 'Welcome! Logging you in...'}
                            </button>
                            {type === 'Login' ? 
                                <span className="small-font">
                                    Forgot your <a className="dark-green" href="/">username</a> or <a className="dark-green" href="/">password</a>?
                                </span>
                            :
                                <span className="small-font">
                                    Already a panda? <a className="dark-green" href="/">Log in</a>
                                </span> 
                            }                 
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form;