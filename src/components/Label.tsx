type LabelType = { label: string, htmlFor?: string, className?: string }

const Label = ({ label, htmlFor, className }: LabelType) => {
    return (
        <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${className}`} htmlFor={htmlFor}>
            {label}
        </label>
    )
}

export default Label