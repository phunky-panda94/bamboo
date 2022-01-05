import './Form.css';
import Field from './Field';

function Form() {
    return (
        <div className="modal flex flex-jc-c flex-ai-c">
            <div className="bg-white form flex flex-row">
                <div>
                    <img src="/tree.png"></img>
                </div>
                <form className="form-field-group flex flex-col flex-jc-c">
                    <h3>Login</h3>
                    <Field name="email" label="Email"/>
                    <Field name="password" label="Password" />
                    <button type="submit">Log In</button>
                    <span className="small-font">
                        Forgot your <a className="dark-green">username</a> or <a className="dark-green">password</a>?
                    </span>
                </form>
                <div className="border">
                    <span className="grey close">&times;</span>
                </div>
            </div>
        </div>
    )
}

export default Form;