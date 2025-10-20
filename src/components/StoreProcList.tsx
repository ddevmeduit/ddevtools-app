import { useEffect } from 'react'

import Button from "./Button"
import SectionTitle from "./SectionTitle"


function StoreProcList(props: { steps: string[] }) {
    const { steps } = props
    const generatedSPs: string[] = []

    useEffect(() => {
        steps.forEach(step => {
            generatedSPs.push(generateSp(step))
        })

        console.log(generatedSPs.length)
    }, [steps.length])

    const generateSp = (stepName: string) => {
return `create procedure ${stepName}
returns varchar
language sql
execute as owner
as
begin
    -- TODO: SP BODY HERE
end;
`
    }

    const handleCopyAllToClipboard = () => {
        let SPs = ""

        generatedSPs.forEach(sp => {
            SPs += sp + '\n'
        })

        navigator.clipboard.writeText(SPs)
    }

    return (
        <>
            <SectionTitle text="Boilerplate">
                <Button onClick={handleCopyAllToClipboard}>Copy All</Button>
            </SectionTitle>
            <div className="grid grid-cols-2 gap-2">
                {
                    steps.map(step => (
                        <div key={step} className="whitespace-pre-line bg-slate-200 rounded-lg p-4 overflow-x-auto">
                            {generateSp(step)}
                        </div>
                    ))   
                }
            </div>
        </>
    )
}

export default StoreProcList
/*
create procedure bi_etl.some_name()
returns varchar
language sql
execute as owner
as
begin
    -- TODO: SP BODY
end;

*/