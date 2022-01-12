import './Form.css';

function Field(props) {

    const { name, label, type } = props

    return (
        <div className="form-field">
            <label htmlFor={name}/>
            <input name={name} type={type} placeholder={label} className="field"/>
        </div>
    )   
}

export default Field;