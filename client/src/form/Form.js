import './Form.css';
import Field from './Field';

function Form(props) {

    const { toggleForm, type } = props

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        let details = {
            email: event.target.elements['email'].value,
            password: event.target.elements['password'].value
        }
        console.log(details)
        let api = 'http://localhost:8000/api/user/';
        type == 'Login' ? api += 'login' : api += 'register'; 
        console.log(api);
        const response = await fetch(api, 
            { 
                method: 'post',
                mode: 'cors',
                body: details
            }
        );
    
        console.log(response.json());
    }

    return (
        <div className="modal flex flex-jc-c flex-ai-c">
            <div className="bg-white form flex flex-row">
                <div>
                    <img className="banner" src="/tree.png"></img>
                </div>
                <div className="form-container flex flex-col">
                    <div className ="close flex flex-jc-fe">
                        <span className="grey close-btn" onClick={() => toggleForm()}>&times;</span>
                    </div>
                    <div className="form-container flex flex-jc-c flex-ai-c">
                        <form className="form-field-group flex flex-col" onSubmit={handleSubmit}>
                            <h3>{type}</h3>
                            {type == 'Sign Up' &&
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