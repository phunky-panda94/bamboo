import './Form.css';
import Field from './Field';

function Form() {
    return (
        <div className="modal flex flex-jc-c flex-ai-c">
            <div className="bg-white form flex flex-row">
                <div>
                    <img src="/tree.png"></img>
                </div>
                <div className="form-container flex flex-col">
                    <div className="flex flex-jc-fe">
                        <span className="grey close">&times;</span>
                    </div>
                    <div className="form-container flex flex-jc-c flex-ai-c">
                        <form className="form-field-group flex flex-col">
                            <h3>Login</h3>
                            <Field name="email" label="Email"/>
                            <Field name="password" label="Password" />
                            <button type="submit">Log In</button>
                            <span className="small-font">
                                Forgot your <a className="dark-green">username</a> or <a className="dark-green">password</a>?
                            </span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form;