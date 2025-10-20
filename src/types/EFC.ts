export type EFCObject = {
    rows: EFCRow[]
}

export type EFCRow = {
    client_name: string, 
    date_pattern: string, 
    delivery_schedule: string, 
    delivery_timestamp: string, 
    deviation_threshold: number, 
    directory_path: string,
    dont_warn: boolean,
    expected_time: string,
    file_count: number,
    file_pattern: string,
    file_size: number,
    file_type: string,
    filename: string,
    full_path: string,
    hash: string,
    last_delivery: string,
    process_timestamp: string,
    status: string
}
