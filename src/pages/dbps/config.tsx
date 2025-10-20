import { useState } from "react"

import SectionTitle from "../../components/SectionTitle"
import Button from "../../components/Button"
import Model from "../../components/Model"
import PasteBox from "../../components/PasteBox"
import Input from "../../components/Input"
import Label from "../../components/Label"
import Output from "../../components/Output"
import type { DBPSFileContextVariables, DBPSFileFormat, DBPSJSONObject } from "../../types/DBPS"

const DBPSConfig = () => {
	const [locationId, setLocationId] = useState<number>(0)
	const [targetTimezone, setTargetTimezone] = useState("America/New_York")
	const [recordSource, setRecordSource] = useState("")
	const [fileMask, setFileMask] = useState("")
	const [recordTarget, setRecordTarget] = useState("")
	const [tempTable, setTempTable] = useState("")
	const [deltaTable, setDeltaTable] = useState("")
	const [stageTable, setStageTable] = useState("")
	const [executionType, setExecutionType] = useState("")
	const [category, setCategory] = useState("")
	const [fieldsToHash, setFieldsToHash] = useState("")
	const [sourceQuery, setSourceQuery] = useState("")
	const [sourcePath, setSourcePath] = useState("")
	const [step, setStep] = useState("")
	const [steps, setSteps] = useState<string[]>([])
	const [stepsNames, setStepsNames] = useState<string[]>([])
	const [taskType, setTaskType] = useState("standard")
	const [pasteContent, setPasteContent] = useState("")
	const [pasteBoxIsOpen, setPasteBoxIsOpen] = useState<boolean>(false)
	const [fileImportIsOpen, setFileImportIsOpen] = useState<boolean>(false)
	const [hasDeltaStep, setHasDeltaStep] = useState<boolean>(true)
	const [hasStageStep, setHasStageStep] = useState<boolean>(true)
	const [hasDeleteStep, setHasDeleteStep] = useState<boolean>(false)
	const [pkPosition, setPkPosition] = useState<number>(1)
	const [sourceFileType, setSourceFileType] = useState("")

	const [errorThreshold, setErrorThreshold] = useState(-1)
	const [fileNameDateFormat, setFileNameDateFormat] = useState("")

	// snowflake settings
	const [fileType] = useState("CSV")
	const [recordDelimiter, setRecordDelimiter] = useState("\\r\\n")
	const [fieldDelimiter, setFieldDelimiter] = useState(",")
	const [skipHeader, setSkipHeader] = useState<number>(0)
	const [dateFormat, setDateFormat] = useState("AUTO")
	const [escapeCharacter, setEscapeCharacter] = useState("NONE")
	const [fieldEnclosedBy, setFieldEnclosedBy] = useState("NONE")
	const [nullIfArray, setNullIfArray] = useState(["\\\\N"])
	const [nullIfStr, setNullIfStr] = useState("")
	const [encoding, setEncoding] = useState("UTF8")
	const [trimSpace, setTrimSpace] = useState<boolean>(false)
	const [emptyFieldAsNull, setEmptyFieldAsNull] = useState<boolean>(true)
	const [compression, setCompression] = useState("AUTO")
	const [fileExtension, setFileExtension] = useState("")
	const [timeFormat, setTimeFormat] = useState("AUTO")
	const [timeStampFormat, setTimeStampFormat] = useState("AUTO")
	const [binaryFormat, setBinaryFormat] = useState("HEX")
	const [escapeUnenclosedField, setEscapeUnenclosedField] = useState("\\\\")
	const [skipBlankLines, setSkipBlankLines] = useState<boolean>(false)
	const [errorOnColumnCountMismatch, setErrorOnColumnCountMismatch] = useState<boolean>(true)
	const [replaceInvalidCharacters, setReplaceInvalidCharacters] = useState<boolean>(false)
	const [skipByteOrderMark, setSkipByteOrderMark] = useState<boolean>(true)

	const [advOptionsIsOpen, setAdvOptionsIsOpen] = useState(false)

	const jobCategories = ["ACCOUNT", "FINANCIAL", "LOOKUP", "TRANSFORMATION"];
	const jobPrioritys = ["STANDARD", "CRITICAL"]
	const [jobCategory, setJobCategory] = useState(jobCategories[0])
	const [jobPriority, setJobPriority] = useState(jobPrioritys[0])


	const handleAddNullIf = (str: string) => {
		const arr = nullIfArray

		if (!arr.includes(str)) {
			arr.push(str)
			setNullIfArray(arr)
			setNullIfStr("")
		}
	}

	const handleDeleteNullIf = (str: string) => {
		setNullIfArray(prevArray => {
			const indexToDelete = prevArray.lastIndexOf(str)
			const newArray = [...prevArray]
			if (indexToDelete !== -1) {
				newArray.splice(indexToDelete, 1)
			}
			return newArray
		})
		setNullIfStr("")
	};

	const handleAddDeleteStep = () => {
		setHasDeleteStep(prev => !prev)
		const step = `call ${category.toLocaleLowerCase()}.sp_delete_from_${stageTable}()`

		if (hasDeleteStep) {
			setSteps(prevArr => {
				const indexToDelete = prevArr.lastIndexOf(step)
				const newArr = [...prevArr]
				if (indexToDelete !== -1) {
					newArr.splice(indexToDelete, 1)
				}
				return newArr
			})
		} else {
			setSteps(prevArr => {
				const newArr = [...prevArr]
				newArr.push(step)
				return newArr
			})
		}
	};


	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(instructionsObject, null, 2))
	}

	const handleExportToFile = () => {
		const json = JSON.stringify(instructionsObject, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'dbps_instructions.json';
		link.click();

		URL.revokeObjectURL(url);
	}

	const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0]
			const fileReader = new FileReader()

			fileReader.onload = (event: ProgressEvent<FileReader>) => {
				if (event.target) {
					const content = event.target.result
					if (content) {
						updateState(JSON.parse(content.toString()))
					} else {
						return
					}
				} else {
					return
				}
			}

			fileReader.readAsText(file)
		} else {
			return
		}
	}

	const handlePaste = () => {
		updateState(JSON.parse(pasteContent), false)
		setPasteContent("")
	}

	const updateState = (update: DBPSJSONObject, updateSteps = true) => {
		setLocationId(update.context_variables.location_id || locationId)
		setTargetTimezone(update.context_variables.target_timezone || targetTimezone)
		setRecordSource(update.context_variables.record_source || recordSource)
		setRecordTarget(update.context_variables.record_target || recordTarget)
		setTempTable(update.context_variables.temp_table || tempTable)
		setDeltaTable(update.context_variables.delta_table || deltaTable)
		setStageTable(update.context_variables.stage_table || stageTable)
		setExecutionType(update.context_variables.execution_type || executionType)
		setCategory(update.context_variables.category || category)
		setSourceQuery(update.context_variables.source_query || sourceQuery)
		setFieldsToHash(update.context_variables.fields_to_hash || fieldsToHash)
		setTaskType(update.context_variables.task_type || taskType)
		setJobCategory(update.context_variables.job_category || jobCategory)
		setJobPriority(update.context_variables.job_priority || jobPriority)

		if (update.file_context_variable) {
			setFileMask(update.file_context_variable.file_mask || fileMask)
			setSourceFileType(update.file_context_variable.source_file_type)
			setSourcePath(update.file_context_variable.source_path || sourcePath)
			setErrorThreshold(update.file_context_variable.error_threshold || errorThreshold)
			setFileNameDateFormat(update.file_context_variable.date_format || fileNameDateFormat)
			setPkPosition(update.file_context_variable.pk_position)
		}

		if (update.file_format) {
			setRecordDelimiter(update.file_format.record_delimiter || recordDelimiter)
			setFieldDelimiter(update.file_format.field_delimiter || fieldDelimiter)
			setSkipHeader(update.file_format.skip_header || skipHeader)
			setDateFormat(update.file_format.date_format || dateFormat)
			setEscapeCharacter(update.file_format.escape_character || escapeCharacter)
			setFieldEnclosedBy(update.file_format.field_enclosed_by || fieldEnclosedBy)
			setNullIfArray(update.file_format.null_if || nullIfArray)
			setEncoding(update.file_format.encoding || encoding)
			setTrimSpace(update.file_format.trim_space || trimSpace)
			setEmptyFieldAsNull(update.file_format.empty_field_as_null || emptyFieldAsNull)
			setCompression(update.file_format.compression || compression)
			setFileExtension(update.file_format.file_extension || fileExtension)
			setTimeFormat(update.file_format.time_format || timeFormat)
			setTimeStampFormat(update.file_format.time_stamp_format || timeStampFormat)
			setBinaryFormat(update.file_format.binary_format || binaryFormat)
			setEscapeUnenclosedField(update.file_format.escape_unenclosed_field || escapeUnenclosedField)
			setSkipBlankLines(update.file_format.skip_blank_lines || skipBlankLines)
			setErrorOnColumnCountMismatch(update.file_format.error_on_column_count_mismatch || errorOnColumnCountMismatch)
			setReplaceInvalidCharacters(update.file_format.replace_invalid_characters || replaceInvalidCharacters)
			setSkipByteOrderMark(update.file_format.skip_byte_order_mark || skipByteOrderMark)
		}

		if (updateSteps) setSteps(update.steps || steps)
	}

	const handleAddStep = (str: string) => {
		const jsonSteps = steps
		const namesSteps = stepsNames

		if (!jsonSteps.includes(str)) {
			jsonSteps.push(`call ${category.toLocaleLowerCase()}.${str}`)
			setSteps(jsonSteps)

			namesSteps.push(`${category.toLocaleLowerCase()}.${str}`)
			setStepsNames(namesSteps)
		}

		setStep("")
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

		setStepsNames(prevArray => {
			const indexToDelete = prevArray.lastIndexOf(str.substring(5).trim())
			const newArray = [...prevArray]
			if (indexToDelete !== -1) {
				newArray.splice(indexToDelete, 1)
			}
			return newArray
		})
		setStep("")
	}

	const handleInputQuery = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		let input = e.target.value;

		input = input.replace(/,\s+/g, ",").replace(/\s+,/g, ",")
		input = input.replace(/[\t]/g, "")
		input = input.replace(/[\n\r]/g, " ")

		return input;
	}

	const handleTaskType = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "steps_only") {
			setHasDeltaStep(false)
			setHasStageStep(false)
		} else {
			setHasDeltaStep(true)
			setHasStageStep(true)
		}

		setTaskType(e.target.value)
	}

	const autoSteps = () => {
		const arr = []

		if (hasDeltaStep) {
			arr.push(`call ${category.toLocaleLowerCase()}.sp_delta(${locationId}, '${tempTable}', '${deltaTable}', '${fieldsToHash}', '${recordSource}')`)
		}

		if (hasStageStep) {
			arr.push(`call ${category.toLocaleLowerCase()}.sp_stage_${stageTable}(${locationId}, '${tempTable}', '${deltaTable}', '${stageTable}', '${recordSource}')`)
		}

		return arr
	}

	const instructionsFileFormatObject: DBPSFileFormat = {
		"file_type": fileType,
		"record_delimiter": recordDelimiter,
		"field_delimiter": fieldDelimiter,
		"skip_header": skipHeader,
		"date_format": dateFormat,
		"escape_character": escapeCharacter,
		"field_enclosed_by": fieldEnclosedBy,
		"null_if": nullIfArray,
		"encoding": encoding,
		"trim_space": trimSpace,
		"empty_field_as_null": emptyFieldAsNull,
		"compression": compression,
		"file_extension": fileExtension,
		"time_format": timeFormat,
		"time_stamp_format": timeStampFormat,
		"binary_format": binaryFormat,
		"escape_unenclosed_field": escapeUnenclosedField,
		"skip_blank_lines": skipBlankLines,
		"error_on_column_count_mismatch": errorOnColumnCountMismatch,
		"replace_invalid_characters": replaceInvalidCharacters,
		"skip_byte_order_mark": skipByteOrderMark
	}

	const fileContextVariable: DBPSFileContextVariables = {
		file_mask: fileMask,
		source_file_type: sourceFileType,
		source_path: sourcePath,
		error_threshold: errorThreshold,
		date_format: fileNameDateFormat,
		pk_position: pkPosition
	}

	const instructionsObject: DBPSJSONObject = {
		"context_variables": {
			"location_id": locationId,
			"target_timezone": targetTimezone,
			"record_source": recordSource,
			"record_target": recordTarget,
			"temp_table": tempTable,
			"delta_table": deltaTable,
			"stage_table": stageTable,
			"execution_type": executionType,
			"category": category,
			"fields_to_hash": fieldsToHash,
			"source_query": sourceQuery,
			"task_type": taskType,
			job_category: jobCategory,
			job_priority: jobPriority
		},
		file_context_variable: taskType === 'file' ? fileContextVariable : undefined,
		file_format: taskType === 'file' ? instructionsFileFormatObject : undefined,
		"steps": [
			...autoSteps(),
			...steps
		]
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				<div>
					{/* <!-- context vars settings --> */}
					<SectionTitle text="Context Variables">
						<div>
							<Button onClick={() => setPasteBoxIsOpen(prevState => !prevState)}>Paste</Button>
							<Model
								title="Paste Box"
								isOpen={pasteBoxIsOpen}
								onClickClose={() => { setPasteBoxIsOpen(prevState => !prevState); setPasteContent(""); }}
								onClickSubmit={() => { handlePaste(); setPasteBoxIsOpen(false); }}
							>
								<PasteBox value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} />
							</Model>
						</div>
						<div>
							<Button onClick={() => setFileImportIsOpen(prevState => !prevState)}>Import File</Button>
							<Model
								title="File Import"
								isOpen={fileImportIsOpen}
								onClickClose={() => setFileImportIsOpen(prevState => !prevState)}
							>
								<Input id="file-upload" type="file" onChange={handleFileRead} />
							</Model>
						</div>
					</SectionTitle>

					<div className="grid grid-cols-2">
						<Input id="location-id" type="number" label="Location Id" value={locationId} onChange={e => setLocationId(parseInt(e.target.value, 10))} />
						<Input id="target-timezone" label="Target Timezone" value={targetTimezone} onChange={e => setTargetTimezone(e.target.value)} />
						{taskType === "standard" && <Input id="record-source" label="Record Source" value={recordSource} onChange={e => setRecordSource(e.target.value)} />}
						<Input id="record-type" label="Record Target" value={recordTarget} onChange={e => setRecordTarget(e.target.value)} />
					</div>

					<div className="grid grid-cols-2">
						<Input id="temp-table" label="Temp Table" value={tempTable} onChange={e => setTempTable(e.target.value)} />
						<Input id="delta-table" label="Delta Table" value={deltaTable} onChange={e => setDeltaTable(e.target.value)} />
						<Input id="stage-table" label="Stage Table" value={stageTable} onChange={e => setStageTable(e.target.value)} />
					</div>

					<div className="grid grid-cols-2">
						<Input id="execution-type" label="Exeuction Type" value={executionType} onChange={e => setExecutionType(e.target.value)} />
						<Input id="category" label="Category" value={category} onChange={e => setCategory(e.target.value)} />
					</div>
					<Input id="fields-to-hash" label="Fields To Hash" value={fieldsToHash} onChange={e => setFieldsToHash(handleInputQuery(e))} />
					<Input id="category" label="Category" value={category} onChange={e => setCategory(e.target.value)} />
					{
						taskType === 'standard' && (
							<div className="mx-3">
								<Label label="Source Query" />
								<PasteBox value={sourceQuery} onChange={(e) => setSourceQuery(handleInputQuery(e))} />
							</div>
						)
					}
					<div className="mx-3">
						<Input id="task-type-standard" type="radio" label="Standard Task" value="standard" checked={taskType === "standard"} onChange={handleTaskType} />
						<Input id="task-type-file" type="radio" label="File Task" value="file" checked={taskType === "file"} onChange={handleTaskType} />
					</div>

					<div className="flex mx-3">
						<div className="w-full">
							<Label label="Job Category" htmlFor="job-category" />
							<select name="job-category" id="job-category" value={jobCategory} onChange={e => setJobCategory(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
								{jobCategories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
						<div className="w-full">
							<Label label="Job Priority" htmlFor="job-priority" />
							<select name="JOB-PRIORITY" id="job-priority" value={jobPriority} onChange={e => setJobPriority(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
								{jobPrioritys.map((priority) => (
									<option key={priority} value={priority}>
										{priority}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* <!-- context vars end --> */}

					{
						taskType === "file" && (
							<div>
								<SectionTitle text="File Context Vars" />
								<div className="grid grid-cols-2">
									<Input id="file-mask" label="File Mask" value={fileMask} onChange={e => setFileMask(e.target.value)} />
									<Input id="source-file-type" label="Source File Type" value={sourceFileType} onChange={e => setSourceFileType(e.target.value)} />
									<Input id="source-path" label="Source Directory" placeholder="/location/to/file/" value={sourcePath} onChange={e => setSourcePath(e.target.value)} />
									<Input id="error-threshold" label="Error Threshold" placeholder="-1 or >=1" value={errorThreshold} onChange={e => setErrorThreshold(parseInt(e.target.value, 10))} />
									<Input id="file-name-date-format" label="File Name Date Format" placeholder="yyyyMMdd" value={fileNameDateFormat} onChange={e => setFileNameDateFormat(e.target.value)} />
									<Input id="pk-position" label="_PK Position" placeholder="ex: 1" value={pkPosition} onChange={e => setPkPosition(parseInt(e.target.value, 10))} />
								</div>

								<SectionTitle text="Snowflake Settings" />
								<div className="grid grid-cols-2">
									<Input id="file-type-ext" label="File Type (Extension)" placeholder="File Type" value={fileType} readOnly={true} />
									<Input id="row-delimiter" label="Row Separator" placeholder="End of row character" value={recordDelimiter} onChange={e => setRecordDelimiter(e.target.value)} />
									<Input id="field-delimiter" label="Field Delimiter" placeholder="Field Delimiter" value={fieldDelimiter} onChange={e => setFieldDelimiter(e.target.value)} />
									<Input id="skip-header" type="number" label="Skip Header" placeholder="0" value={skipHeader} onChange={e => setSkipHeader(parseInt(e.target.value, 10))} />
									<Input id="date-format" label="Date Format" placeholder="Ex: mmYYYYdd" value={dateFormat} onChange={e => setDateFormat(e.target.value)} />
									<Input id="escape-character" label="Escape Character" value={escapeCharacter} onChange={e => setEscapeCharacter(e.target.value)} />
									<Input id="field-optionally-enclosed-by" label="Field Enclosed By" value={fieldEnclosedBy} onChange={e => setFieldEnclosedBy(e.target.value)} />
									<Input id="encoding" label="Encoding" value={encoding} onChange={e => setEncoding(e.target.value)} />
								</div>
								<div>
									<Label label="Null If..." className="mx-3" />

									{nullIfArray.map(nullIf => (
										<Input key={`list-item-${nullIf}`} id={nullIf} value={nullIf} readOnly>
											<Button key={`delete-btn-${nullIf}`} onClick={() => handleDeleteNullIf(nullIf)} role="distroy">Delete</Button>
										</Input>
									))}
									<Input placeholder="some_extact_string" value={nullIfStr} onChange={e => setNullIfStr(e.target.value)}>
										<Button onClick={() => handleAddNullIf(nullIfStr)}>Add</Button>
									</Input>
								</div>
								<div className='mx-3'>
									<Input id="trim-space" type="checkbox" label="Time Space" checked={trimSpace} onChange={() => setTrimSpace(prevState => !prevState)} />
									<Input id="empty-field-as-null-checkbox" type="checkbox" label="Empty Field As Null" checked={emptyFieldAsNull} onChange={() => setEmptyFieldAsNull(prevState => !prevState)} />
								</div>

								<div className='mx-3 mt-2'>
									{/* <!-- Button trigger modal --> */}
									<Button onClick={() => setAdvOptionsIsOpen(prevState => !prevState)}>Advanced Options</Button>
									<Model title="Advanced Options" isOpen={advOptionsIsOpen} onClickClose={() => setAdvOptionsIsOpen(prevState => !prevState)}>
										<Input id="compression" label="File Type" value={compression} onChange={e => setCompression(e.target.value)} />
										<Input id="file-extension" label="File Extension" value={fileExtension} onChange={e => setFileExtension(e.target.value)} />
										<Input id="time-format" label="Time Format" value={timeFormat} onChange={e => setTimeFormat(e.target.value)} />
										<Input id="timestamp-format" label="Timestamp Format" value={timeStampFormat} onChange={e => setTimeStampFormat(e.target.value)} />
										<Input id="binary-format" label="Binary Format" value={binaryFormat} onChange={e => setBinaryFormat(e.target.value)} />
										<Input id="escape-unenclosed-field" label="Escape Unenclosed Field" value={escapeUnenclosedField} onChange={e => setEscapeUnenclosedField(e.target.value)} />
										<div className='mx-3'>
											<Input id="skip-blank-lines-checkbox" type="checkbox" label="Skip Blank Lines" checked={skipBlankLines} onChange={() => setSkipBlankLines(prevState => !prevState)} />
											<Input id="error-on-column-count-mismatch-checkbox" type="checkbox" label="Error On Column Count Mismatch" checked={errorOnColumnCountMismatch} onChange={() => setErrorOnColumnCountMismatch(prevState => !prevState)} />
											<Input id="replace-invalid-characters-checkbox" type="checkbox" label="Replace Invalid Characters" checked={replaceInvalidCharacters} onChange={() => setReplaceInvalidCharacters(prevState => !prevState)} />
											<Input id="skip-byte-order-mark-Checkbox" type="checkbox" label="Skip Byte Order Mark" checked={skipByteOrderMark} onChange={() => setSkipByteOrderMark(prevState => !prevState)} />
										</div>
									</Model>
								</div>
							</div>
						)
					}

					<SectionTitle text="Steps" />
					<div className="mx-3">
						<Input id="auto-delta-step" type="checkbox" label="Generate Delta Step" checked={hasDeltaStep} onChange={() => setHasDeltaStep(prevState => !prevState)} />
						<Input id="auto-stage-step" type="checkbox" label="Generate Stage Step" checked={hasStageStep} onChange={() => setHasStageStep(prevState => !prevState)} />
						<Input id="auto-delete-step" type="checkbox" label="Generate Delete Step" checked={hasDeleteStep} onChange={handleAddDeleteStep} />
					</div>
					<div>
						{steps.map(step => (
							<Input key={`list-item-${step}`} id={step} value={step} readOnly>
								<Button onClick={() => handleDeleteStep(step)} role="distroy">Delete</Button>
							</Input>
						))}
						<Input placeholder="Store Procedure Name..." value={step} onChange={e => setStep(e.target.value)}>
							<Button onClick={() => handleAddStep(step)}>Add</Button>
						</Input>
					</div>
				</div>
				<div className="bg-slate-200 rounded-lg px-3">
					<div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
						<SectionTitle text="Output">
							<div className="grid grid-cols-2 gap-1">
								<Button onClick={handleExportToFile}>To File</Button>
								<Button onClick={handleCopyToClipboard}>Copy</Button>
							</div>
						</SectionTitle>

					</div>
					<Output object={instructionsObject} />
				</div>
			</div>
			{/* <div className="mt-4">
				<StoreProcList steps={stepsNames}/>
			</div> */}
		</>
	)
}

export default DBPSConfig