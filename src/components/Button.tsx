const defaultProps = {
    className: "rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-md ring-1 ring-inset ring-gray-300 space-x-4",
    role: "normal"
}

type ButtonProps = {
    children: React.ReactNode, 
    onClick?: () => void, 
    className?: string, 
    role?: string 
}

function Button ({
    children, 
    onClick, 
    className = defaultProps.className, 
    role = defaultProps.role}: ButtonProps
    ) {

    let bgColor = "bg-white text-gray-600 hover:bg-gray-50"
    
    if (role==="distroy") {
        bgColor = "bg-rose-600 text-gray-100 hover:bg-rose-800"
    }

    return (
        <button type="button" className={`${bgColor} ${className}`} onClick={onClick}>
            { children }
        </button>
    )
}
export default Button