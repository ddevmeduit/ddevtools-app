export type DFPSJSONObject = {
    context_variables: {
        error_threshold: number,
        file_date_location: {
            start_index: number,
            length: number
        },
        file_date_format: string
        file_directory: string,
        file_field_count: number,
        file_format: string,
        file_mask: string,
        stage_location: string,
        target_table: string,
    },
    steps: string[]
}