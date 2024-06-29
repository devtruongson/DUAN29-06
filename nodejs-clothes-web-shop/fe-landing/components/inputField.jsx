import { useController } from "react-hook-form";

const InputField = ({ name, control, disabled, placeholder, password }) => {
    const {
        field: { value, ref, onChange, onBlur },
        fieldState: { error }
    } = useController({ name, control });

    return (
        <div className="input-field">
            <input
                className={'input' + (!!error ? ' has-error' : '') + (!!disabled ? ' disabled' : '')}
                value={value} type={password ? "password" : "text"}
                disabled={!!disabled}
                placeholder={placeholder}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
            />
            {!!error && <p className="error-message">{error.message}</p>}
        </div>
    );
};

export default InputField;
