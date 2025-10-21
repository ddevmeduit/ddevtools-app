import Label from "./Label"
const defaultProps = {
    type: "text"
}

type InputType = {
    id?: string,
    label?: string,
    placeholder?: string,
    value?: string | number | readonly string[],
    checked?: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    readOnly?: boolean,
    children?: React.ReactNode
}

const Input = ({
    id,
    label,
    placeholder,
    value,
    checked,
    onChange,
    type = defaultProps.type,
    readOnly,
    children
}: InputType) => {
    if (type === "checkbox" || type === "radio") {
        return (
            <label className="md:w-2/3 block text-gray-500 font-bold">
                <input className="mr-2 leading-tight" type={type} value={value} checked={checked} onChange={onChange} />
                <span className="text-sm">
                    {label}
                </span>
            </label>
        )
    }

    return (
        <div className="w-full px-3">
            {label && (<Label label={label} htmlFor={id} />)}
            <div className="relative">
                <input className="appearance-none block w-full bg-slate-100 text-gray-700 rounded py-3 px-4 mb-3 focus:outline-none" id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly} />
                <div className="absolute bottom-2 right-2">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Input