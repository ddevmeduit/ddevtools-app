export type DMRSJSONObject = {
    context_variables: {
        error_threshold: number,
        file_date_location: {
            start_index: number,
            length: number
        },
        record_id_field_position?: number, // if file is standard (default)
        record_id_location?: DMRSPositionalFile, // if file is positional
        file_date_format: string
        file_directory: string,
        file_format: string,
        file_mask: string,
        files_table: string,
        metadata_id: string,
        stage_location: string,
    }
}

export type DMRSPositionalFile = {
    start: number,
    length: number
}
export type DMRSStepsQuery = string
