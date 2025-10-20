type PasteBoxType = {
    value?: string | number | readonly string[], 
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void 
}

const PasteBox = ({value, onChange}: PasteBoxType) => {
    return (
        <code>
            <textarea 
                className="w-full border rounded-lg p-5" 
                style={{ height: "400px" }} 
                value={value} 
                onChange={onChange} 
            />
        </code>
    )
}

export default PasteBox