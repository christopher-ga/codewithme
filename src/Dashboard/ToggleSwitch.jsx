
const ToggleSwitch = () => {

    return (
        <>
            <input type="checkbox" className="react-switch-checkbox" id={`react-switch-new`}/>
            <label htmlFor={`react-switch-new`} className="react-switch-label">
                <span className={`react-switch-button`}/>
            </label>
        </>
    )
}

export default ToggleSwitch;