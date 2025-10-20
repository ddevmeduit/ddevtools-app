import type { DBPSJSONObject } from "../types/DBPS"
import type { DFPSJSONObject } from "../types/DFPS"
import type { DMRSJSONObject, DMRSStepsQuery } from "../types/DMRS"

type OutputType = { object: DFPSJSONObject | DBPSJSONObject | DMRSJSONObject | DMRSStepsQuery | string } 

const Output = ({object}: OutputType) => {
    return (
        <div className="overflow-x-auto">
            <code>
                <pre>
                    {typeof object === "string" ? object : JSON.stringify(object, null, 2)}
                </pre>
            </code>
        </div>
    )
}

export default Output