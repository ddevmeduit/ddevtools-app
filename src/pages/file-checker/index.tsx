import { useState } from 'react'

import SectionTitle from "../../components/SectionTitle"
import Button from "../../components/Button"
import Model from '../../components/Model'
import PasteBox from "../../components/PasteBox"

import type { EFCRow } from "../../types/EFC.ts"
import EFCTable from "../../components/EFCTable.tsx"

const FileCheckerHome = () => {
    const [pasteBoxIsOpen, setPasteBoxIsOpen] = useState(false);
    const [pasteContent, setPasteContent] = useState("")
    const [data, setData] = useState<EFCRow[]>([]);
    const handlePaste = () => {
        var obj: EFCRow[] = JSON.parse(pasteContent)["data"];
        setData(obj.map(item => item as EFCRow));
    }

    return (
        <div>
            <div className="grid my-2">
                <SectionTitle text="Expected File Check">
                <Button onClick={() => setPasteBoxIsOpen(prevState => !prevState)}>Paste</Button>
                <Model title="Paste Box" isOpen={pasteBoxIsOpen} onClickClose={() => setPasteBoxIsOpen(prevState => !prevState)} onClickSubmit={handlePaste}>
                    <PasteBox value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} />
                </Model>
                </SectionTitle>
            </div>
            <EFCTable data={data} />
        </div>
    );
}

export default FileCheckerHome