import React, { createContext, useContext, useState } from "react";

interface DMRSContextType {
  errorThreshold: number
  setErrorThreshold: (newValue: number) => void
  fileDateStartIndex: number
  setFileDateStartIndex: (newValue: number) => void
  fileDateLength: number
  setFileDateLength: (newValue: number) => void
  recordIdFieldPosition: number
  setRecordIdFieldPosition: (newValue: number) => void
  dateFormatInFileName: string
  setDateFormatInFileName: (newValue: string) => void
  fileLocation: string
  setFileLocation: (newValue: string) => void
  fileFormat: string
  setFileFormat: (newValue: string) => void
  fileMask: string
  setFileMask: (newValue: string) => void
  tempFilesTable: string
  setTempFilesTable: (newValue: string) => void
  metadataId: string
  setMetadataId: (newValue: string) => void
  stageLocation: string
  setStageLocation: (newValue: string) => void
  recordIdLocationStart: number
  setRecordIdLocationStart: (newValue: number) => void
  recordIdLocationLength: number
  setRecordIdLocationLength: (newValue: number) => void
}

const DMRSContext = createContext<DMRSContextType | null>(null)

export default function DMRSProvider({ children }: { children: React.ReactNode }) {
  const [errorThreshold, setErrorThreshold] = useState<number>(0)
  const [fileDateStartIndex, setFileDateStartIndex] = useState<number>(24)
  const [fileDateLength, setFileDateLength] = useState<number>(8)
  const [recordIdFieldPosition, setRecordIdFieldPosition] = useState<number>(1)
  const [dateFormatInFileName, setDateFormatInFileName] = useState("yyyyMMdd")
  const [fileLocation, setFileLocation] = useState("")
  const [fileFormat, setFileFormat] = useState("")
  const [fileMask, setFileMask] = useState("")
  const [tempFilesTable, setTempFilesTable] = useState("")
  const [metadataId, setMetadataId] = useState("")
  const [stageLocation, setStageLocation] = useState("")
  const [recordIdLocationStart, setRecordIdLocationStart] = useState<number>(249)
  const [recordIdLocationLength, setRecordIdLocationLength] = useState<number>(2)

  return (
    <DMRSContext.Provider
      value={{
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
        setRecordIdLocationLength
      }}
    >
      {children}
    </DMRSContext.Provider>
  )
}

export function useDMRS(): DMRSContextType {
  const context = useContext(DMRSContext)
  if (!context) {
    throw new Error("useDMRS must be used within DMRSProvider")
  }
  return context
} 