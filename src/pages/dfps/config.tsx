import { useState } from 'react'

import SectionTitle from "../../components/SectionTitle"
import PasteBox from '../../components/PasteBox'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Model from '../../components/Model'
import Output from '../../components/Output'
import type { DFPSJSONObject } from '../../types/DFPS'

const DFPSConfig = () => {
	// context vars
	const [errorThreshold, setErrorThreshold] = useState<number>(0)
	const [fileDateStartIndex, setFileDateStartIndex] = useState<number>(24)
	const [fileDateLength, setFileDateLength] = useState<number>(8)
	const [fileDateFormat, setFileDateFormat] = useState("")
	const [fileDir, setFileDir] = useState("")
	const [fileFieldCount, setFileFieldCount] = useState<number>(0)
	const [fileFormat, setFileFormat] = useState("FF_")
	const [fileMask, setFileMask] = useState("")
	const [stageLocation, setStageLocation] = useState("")
	const [targetTable, setTargetTable] = useState("")

	// steps
	const [step, setStep] = useState("")
	const [steps, setSteps] = useState<string[]>([])

	const [pasteContent, setPasteContent] = useState("")
	const [pasteBoxIsOpen, setPasteBoxIsOpen] = useState(false)

	const instructionsObject: DFPSJSONObject = {
		"context_variables": {
			"error_threshold": errorThreshold,
			file_date_location: {
				start_index: fileDateStartIndex,
				length: fileDateLength
			},
			"file_date_format": fileDateFormat,
			"file_directory": fileDir,
			"file_field_count": fileFieldCount,
			"file_format": fileFormat,
			"file_mask": fileMask,
			"stage_location": stageLocation,
			"target_table": targetTable
		},
		"steps": steps
	}

	const handleAddStep = (str: string) => {
		const arr = steps

		if (!arr.includes(str)) {
			arr.push(`call ${str}`)
			setSteps(arr)
			setStep("")
		}
	}

	const handleDeleteStep = (str: string) => {
		setSteps(prevArray => {
			const indexToDelete = prevArray.lastIndexOf(str)
			const newArray = [...prevArray]
			if (indexToDelete !== -1) {
				newArray.splice(indexToDelete, 1)
			}
			return newArray
		})
		setStep("")
	}

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(instructionsObject, null, 2))
	}

	const handlePaste = () => {
		updateState(
			JSON.parse(pasteContent)
		)
	}

	const updateState = (update: DFPSJSONObject) => {
		setErrorThreshold(update.context_variables.error_threshold || errorThreshold)
		if (update.context_variables.file_date_location) {
			setFileDateStartIndex(update.context_variables.file_date_location.start_index || fileDateStartIndex)
			setFileDateLength(update.context_variables.file_date_location.length || fileDateLength)
		}
		setFileDateFormat(update.context_variables.file_date_format || fileDateFormat)
		setFileDir(update.context_variables.file_directory || fileDir)
		setFileFieldCount(update.context_variables.file_field_count || fileFieldCount)
		setFileFormat(update.context_variables.file_format || fileFormat)
		setFileMask(update.context_variables.file_mask || fileMask)
		setStageLocation(update.context_variables.stage_location || stageLocation)
		setTargetTable(update.context_variables.target_table || targetTable)

		setSteps(update.steps || steps)
	}

	return (
		<div>
			<div className="grid gap-x-4 grid-cols-2 my-2">
				<div>
					{/* <!-- context vars settings --> */}
					<SectionTitle text="Context Variables">
						<div>
							<Button onClick={() => setPasteBoxIsOpen(prevState => !prevState)}>Paste</Button>
							<Model title="Paste Box" isOpen={pasteBoxIsOpen} onClickClose={() => setPasteBoxIsOpen(prevState => !prevState)} onClickSubmit={handlePaste}>
								<PasteBox value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} />
							</Model>
						</div>
					</SectionTitle>

					<div className="grid grid-cols-2">
						<Input id="temp-file-table" label="Target Table" placeholder="TABLE_NAME" value={targetTable} onChange={e => setTargetTable(e.target.value)} />
						<Input id="file-dir" label="File Directory" placeholder="location/to/file/" value={fileDir} onChange={e => setFileDir(e.target.value)} />
						<Input id="file-mask" label="File Mask" placeholder="file_name.*txt" value={fileMask} onChange={e => setFileMask(e.target.value)} />
						<Input id="stage-location" label="Stage Location" placeholder="@STAGE/LOCATION/" value={stageLocation} onChange={e => setStageLocation(e.target.value)} />
						<Input id="error-threshold" type="number" label="Error Threshold" placeholder="Number of times the job can error" value={errorThreshold} onChange={e => setErrorThreshold(parseInt(e.target.value, 10))} />
						<Input id="date-format-in-file-name" label="Date Format (In file name)" placeholder="Ex: mmYYYYdd" value={fileDateFormat} onChange={e => setFileDateFormat(e.target.value)} />

						<Input id="file-date-start-index" type="number" label="Filename's date start index" placeholder="Where the date starts in the filename" value={fileDateStartIndex} onChange={e => setFileDateStartIndex(parseInt(e.target.value, 10))} />
						<Input id="file-date-digit-length" type="number" label="Filename's date part length" placeholder="How long the date is after removing special characters" value={fileDateLength} onChange={e => setFileDateLength(parseInt(e.target.value, 10))} />
						<Input
							id="file-field-count"
							label="Field count in file"
							value={fileFieldCount}
							onChange={e => setFileFieldCount(parseInt(e.target.value, 10))} />
						<Input
							id="file-format-name"
							label="Snowflake File Format"
							placeholder="FF_FILE_FORMAT_UNIVERSAL"
							value={fileFormat}
							onChange={e => setFileFormat(e.target.value)} />
					</div>
					{/* <!-- context vars end --> */}

					{/* <!--Snowflake File htmlFormat Settings end --> */}
					<SectionTitle text="Steps" />

					{steps.map(step => (
						<Input key={`list-item-${step}`} id={step} value={step}>
							<Button key={`delete-btn-${step}`} onClick={() => handleDeleteStep(step)} role="distroy">Delete</Button>
						</Input>
					))}
					<Input placeholder="Store Procedure Name..." value={step} onChange={e => setStep(e.target.value)}>
						<Button onClick={() => handleAddStep(step)}>Add</Button>
					</Input>
				</div>
				<div className="bg-slate-200 rounded-lg px-3">
					<div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
						<SectionTitle text="Output">
							<Button onClick={handleCopyToClipboard}>Copy</Button>
						</SectionTitle>

					</div>
					<Output object={instructionsObject} />
				</div>
			</div>
		</div>
	)
}

export default DFPSConfig