export type DBPSJSONObject = {
    context_variables: {
        location_id: number,
        target_timezone: string,
        record_source: string,
        record_target: string,
        temp_table: string,
        delta_table: string,
        stage_table: string,
        execution_type: string,
        category: string,
        fields_to_hash: string,
        source_query: string,
        task_type: string,
        job_category: string,
        job_priority: string
    },
    file_context_variable?: DBPSFileContextVariables,
    file_format?: DBPSFileFormat,
    steps: string[]
}

export type DBPSFileContextVariables = {
    file_mask: string,
    source_file_type: string,
    source_path: string,
    error_threshold: number,
    date_format: string,
    pk_position: number
}

export type DBPSFileFormat = {
    file_type: string,
    record_delimiter: string,
    field_delimiter: string,
    skip_header: number,
    date_format: string,
    escape_character: string,
    field_enclosed_by: string,
    null_if: string[],
    encoding: string,
    trim_space: boolean,
    empty_field_as_null: boolean,
    compression: string,
    file_extension: string,
    time_format: string,
    time_stamp_format: string,
    binary_format: string,
    escape_unenclosed_field: string,
    skip_blank_lines: boolean,
    error_on_column_count_mismatch: boolean,
    replace_invalid_characters: boolean,
    skip_byte_order_mark: boolean
}