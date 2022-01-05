import './Form.css';

function Field(props) {

    const { name, label } = props

    return (
        <div className="form-field">
            <label for={name}/>
            <input name={name} type="text" placeholder={label} className="field"/>
        </div>
    )   
}

export default Field;