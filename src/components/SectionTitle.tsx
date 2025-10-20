type SectionTitleType = {text: string, children?: React.ReactNode}

const SectionTitle = ({ text, children }: SectionTitleType) => {
    return (
        <div className="border-b my-3 mt-5">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl py-2">{text}</h2>
                <div className="flex space-x-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
export default SectionTitle