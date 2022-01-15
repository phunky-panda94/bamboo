import './Form.css';
import Field from './Field';

function Form(props) {

    const { setLoggedIn, setUser, toggleForm, type } = props

    const handleSubmit = async (event) => {
        event.preventDefault();

        let api;
        let details;

        if (type === 'Login') {
            api = 'http://localhost:8000/api/user/login';
            details = {
                email: event.target.elements['email'].value,
                password: event.target.elements['password'].value
            }
        } else {
            api = 'http://localhost:8000/api/user/register';
            details = {
                firstName: event.target.elements['firstName'].value,
                lastName: event.target.elements['lastName'].value,
                email: event.target.elements['email'].value,
                password: event.target.elements['password'].value
            }
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

        if (type === 'Login' && response.status == 200) {
            let data = await response.json();
            setUser(data.user);
            setLoggedIn(true);
            toggleForm();
        } else if (type === 'Sign Up' && response.status == 201) {
            
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
                            {type === 'Sign Up' &&
                                <>
                                <Field name="firstName" label="Given Name"/>
                                <Field name="lastName" label="Surname"/>
                                </>
                            }
                            <Field name="email" type="text" label="Email"/>
                            <Field name="password" type="password" label="Password" />
                            <button className="bg-dark-green white btn" type="submit">{type === 'Login' ? 'Log In': 'Sign Up'}</button>
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