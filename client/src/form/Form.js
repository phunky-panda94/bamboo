import './Form.css';
import Field from './Field';

function Form(props) {

    const { type } = props

    return (
        <div className="modal flex flex-jc-c flex-ai-c">
            <div className="bg-white form flex flex-row">
                <div>
                    <img className="banner" src="/tree.png"></img>
                </div>
                <div className="form-container flex flex-col">
                    <div className ="close flex flex-jc-fe">
                        <span className="grey close-btn">&times;</span>
                    </div>
                    <div className="form-container flex flex-jc-c flex-ai-c">
                        <form className="form-field-group flex flex-col">
                            <h3>{type}</h3>
                            <Field name="email" label="Email"/>
                            <Field name="password" label="Password" />
                            <button className="bg-dark-green white btn" type="submit">{type === 'Login' ? 'Log In': 'Register'}</button>
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