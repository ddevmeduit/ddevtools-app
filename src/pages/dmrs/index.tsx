import { useState } from 'react'

import SectionTitle from "../../components/SectionTitle"
import PasteBox from '../../components/PasteBox'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Model from '../../components/Model'
import Output from '../../components/Output'
import type { DMRSJSONObject, DMRSPositionalFile, DMRSStepsQuery } from '../../types/DMRS'
import { useDMRS } from '../../context/dmrs-context'

export default function DMRSConfig() {
	// context vars
	const {
		errorThreshold,
		setErrorThreshold,
		fileDateStartIndex,
		setFileDateStartIndex,
		fileDateLength,
		setFileDateLength,
		recordIdFieldPosition,
		setRecordIdFieldPosition,
		dateFormatInFileName,
		setDateFormatInFileName,
		fileLocation,
		setFileLocation,
		fileFormat,
		setFileFormat,
		fileMask,
		setFileMask,
		tempFilesTable,
		setTempFilesTable,
		metadataId,
		setMetadataId,
		stageLocation,
		setStageLocation,
		recordIdLocationStart,
		setRecordIdLocationStart,
		recordIdLocationLength,
		setRecordIdLocationLength,
	} = useDMRS()

	const [isFileStandard, setIsFileStandard] = useState(true)
	const [isFilePositional, setIsFilePositional] = useState(!isFileStandard)

	// steps
	const [step, setStep] = useState("")
	const [steps, setSteps] = useState<string[]>([])

	const [pasteContent, setPasteContent] = useState("")
	const [pasteBoxIsOpen, setPasteBoxIsOpen] = useState(false)

	const recordIdPosition: DMRSPositionalFile = {
		start: recordIdLocationStart,
		length: recordIdLocationLength
	}

	const instructionsObject: DMRSJSONObject = {
		context_variables: {
			error_threshold: errorThreshold,
			file_date_location: {
				start_index: fileDateStartIndex,
				length: fileDateLength
			},
			record_id_field_position: isFileStandard == true ? recordIdFieldPosition : undefined,
			record_id_location: isFilePositional == true ? recordIdPosition : undefined,
			file_date_format: dateFormatInFileName,
			file_directory: fileLocation,
			file_format: fileFormat,
			file_mask: fileMask,
			files_table: tempFilesTable,
			metadata_id: metadataId,
			stage_location: stageLocation,
		}
	}



	let stepsInsertQueryObject: DMRSStepsQuery = `INSERT INTO DMRS_FILE_METADATA \nSELECT \n\t'${metadataId}' AS ID, \n\t'' AS RECORD_ID,\n\t0 AS COL_COUNT, \n\t'' AS TARGET_TABLE, \n\tPARSE_JSON($$${JSON.stringify(steps, null, 2)}$$) AS STEPS\n;`
	let stepsUpdateQueryObject: DMRSStepsQuery = `UPDATE DMRS_FILE_METADATA \nSET \n\tSTEPS = PARSE_JSON($$${JSON.stringify(steps, null, 2)}$$) \nWHERE \n\tID = '${metadataId}' \n\tAND TARGET_TABLE = '' -- FILL IN IN SNOWFLAKE \n;`


	function handleAddStep(str: string) {
		const arr = steps

		if (!arr.includes(str)) {
			arr.push(`call ${str}`)
			setSteps(arr)
			setStep("")

			updateStepsQuery()
		}
	}

	function updateStepsQuery() {
		stepsInsertQueryObject = `INSERT INTO DMRS_FILE_METADATA \nSELECT \n\t'${metadataId}' AS ID, \n\t'' AS RECORD_ID,\n\t0 AS COL_COUNT, \n\t'' AS TARGET_TABLE, \n\tPARSE_JSON($$${JSON.stringify(steps, null, 2)}$$) AS STEPS\n;`
		stepsUpdateQueryObject = `UPDATE DMRS_FILE_METADATA \nSET \n\tSTEPS = PARSE_JSON($$${JSON.stringify(steps, null, 2)}$$) \nWHERE \n\tID = '${metadataId}' \n\tAND TARGET_TABLE = '' -- FILL IN IN SNOWFLAKE \n;`
	}

	function handleDeleteStep(str: string) {
		setSteps(prevArray => {
			const indexToDelete = prevArray.lastIndexOf(str)
			const newArray = [...prevArray]
			if (indexToDelete !== -1) {
				newArray.splice(indexToDelete, 1)
			}
			return newArray
		})
		setStep("")
		updateStepsQuery()
	}

	function handleCopyToClipboard() {
		navigator.clipboard.writeText(JSON.stringify(instructionsObject, null, 2))
	}

	function handleCopyInsertQueryToClipboard() {
		navigator.clipboard.writeText(stepsInsertQueryObject)
	}

	function handleCopyUpdateQueryToClipboard() {
		navigator.clipboard.writeText(stepsUpdateQueryObject)
	}

	function handlePaste() {
		updateState(
			JSON.parse(pasteContent)
		)
	}

	function updateState(update: DMRSJSONObject) {
		setErrorThreshold(update.context_variables.error_threshold || errorThreshold)
		if (update.context_variables.file_date_location) {
			setFileDateStartIndex(update.context_variables.file_date_location.start_index)
			setFileDateLength(update.context_variables.file_date_location.length)
		}
		if (update.context_variables.record_id_field_position) {
			setIsFileStandard(true)
			setIsFilePositional(false)
		}
		if (update.context_variables.record_id_location) {
			setIsFileStandard(false)
			setIsFilePositional(true)
		}

		setRecordIdLocationStart(update.context_variables.record_id_location?.start || recordIdLocationStart)
		setRecordIdLocationLength(update.context_variables.record_id_location?.length || recordIdLocationLength)
		setDateFormatInFileName(update.context_variables.file_date_format || dateFormatInFileName)
		setFileLocation(update.context_variables.file_directory || fileLocation)
		setFileFormat(update.context_variables.file_format || fileFormat)
		setFileMask(update.context_variables.file_mask || fileMask)
		setTempFilesTable(update.context_variables.files_table || tempFilesTable)
		setMetadataId(update.context_variables.metadata_id || metadataId)
		setStageLocation(update.context_variables.stage_location || stageLocation)

		updateStepsQuery()
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
						<Input id="file-date-start-index" type="number" label="Filename's date start index" placeholder="Where the date starts in the filename" value={fileDateStartIndex} onChange={e => setFileDateStartIndex(parseInt(e.target.value, 10))} />
						<Input id="file-date-digit-length" type="number" label="Filename's date part length" placeholder="How long the date is after removing special characters" value={fileDateLength} onChange={e => setFileDateLength(parseInt(e.target.value, 10))} />
						{isFileStandard && <Input id="record-id-field-position" label="Record Id Field Position" placeholder="1 (for first field in the file)" value={recordIdFieldPosition} onChange={e => setRecordIdFieldPosition(parseInt(e.target.value, 10))} />}
						<Input id="date-format-in-file-name" label="Date Format (In file name)" placeholder="yyyyMMdd" value={dateFormatInFileName} onChange={e => setDateFormatInFileName(e.target.value)} />
						<Input id="file-dir" label="File Directory" placeholder="location/to/file/" value={fileLocation} onChange={e => setFileLocation(e.target.value)} />
						<Input id="file-format" label="Snowflake File Format" placeholder="Snowflake's File Format" value={fileFormat} onChange={e => setFileFormat(e.target.value)} />
						<Input id="file-mask" label="File Mask" placeholder="file_name.*txt" value={fileMask} onChange={e => setFileMask(e.target.value)} />
						<Input id="files-list-table" label="Files List Table" placeholder="FILES_LIST_TEMP_TABLE" value={tempFilesTable} onChange={e => setTempFilesTable(e.target.value)} />
						<Input id="metadata-id" label="Metadata Id" placeholder="Some UUID" value={metadataId} onChange={e => { setMetadataId(e.target.value); updateStepsQuery() }} />
						<Input id="stage-location" label="Stage Location" placeholder="@STAGE/LOCATION/" value={stageLocation} onChange={e => setStageLocation(e.target.value)} />
						<Input id="error-threshold" type="number" label="Error Threshold" placeholder="Number of times the job can error" value={errorThreshold} onChange={e => setErrorThreshold(parseInt(e.target.value, 10))} />

						{
							isFilePositional == true && (
								<>
									<Input id="record-id-start-location" type="number" label="Record Id starting position (none-indexing)" placeholder="249" value={recordIdLocationStart} onChange={e => setRecordIdLocationStart(parseInt(e.target.value, 10))} />
									<Input id="record-id-end-location" type="number" label="Record Id character length" placeholder="250" value={recordIdLocationLength} onChange={e => setRecordIdLocationLength(parseInt(e.target.value, 10))} />
								</>
							)
						}
					</div>
					<div className="mx-3">
						{/* <Input id="is-file-positional" type="checkbox" label="Is this file positional (without delimiters)?" checked={isFilePositional} onChange={() => setIsFilePositional(prevState => !prevState)} /> */}
						<Input id="is-file-standard-checkbox" type="radio" label="Standard File" value="standard" checked={isFileStandard} onChange={() => { setIsFileStandard(true); setIsFilePositional(false) }} />
						<Input id="is-file-positional-checkbox" type="radio" label="Positional File" value="positional" checked={isFilePositional} onChange={() => { setIsFileStandard(false); setIsFilePositional(true) }} />
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
				<div>
					<div className="bg-slate-200 rounded-lg px-3">
						<div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
							<SectionTitle text="Main Object">
								<Button onClick={handleCopyToClipboard}>Copy</Button>
							</SectionTitle>

						</div>
						<Output object={instructionsObject} />
					</div>
					<div className="bg-slate-200 rounded-lg px-3">
						<div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
							<SectionTitle text="Insert Query">
								<Button onClick={handleCopyInsertQueryToClipboard}>Copy</Button>
							</SectionTitle>

						</div>
						<Output object={stepsInsertQueryObject} />
					</div>
					<div className="bg-slate-200 rounded-lg px-3">
						<div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
							<SectionTitle text="Update Query">
								<Button onClick={handleCopyUpdateQueryToClipboard}>Copy</Button>
							</SectionTitle>

						</div>
						<Output object={stepsUpdateQueryObject} />
					</div>
				</div>

			</div>
		</div>
	)
}