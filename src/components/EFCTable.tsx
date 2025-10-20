import React from 'react';
import _ from 'lodash';
import { useState } from 'react'

import type { EFCRow } from "../types/EFC.ts";
import Model from "../components/Model.tsx";
import Input from "../components/Input.tsx";

const getColorForStatus = (status: string) : string => {
    switch(status) {
        case "EARLY":
        case "ON TIME":
            return "#8fb935";
        case "LATE":
            return "#e6e22e";
        case "MISSING":
            return "#e64747";
        case "NOT EXPECTED":
        case "NO DATA":
            return "#d3d3d3";
        default:
            return "white";
    }
}

function addDays(date : Date, days : number) : Date {
    let new_date = date;
    new_date.setTime(new_date.getTime() + (days * 24 * 60 * 60 * 1000));
    return new_date;
}

function generateDays() : Date[] {
    let dateArr : Array<Date> = new Array<Date>();
    let currentDate : Date = new Date();
    let beginDate : Date = addDays(new Date(currentDate), -30);
    while (beginDate <= currentDate) {
        dateArr.push(new Date(beginDate));
        beginDate = addDays(beginDate, 1);
    }
    dateArr.reverse();
    return dateArr;
};

const modalContent = (data: EFCRow) => {
    if (!data) return;
    
    return (
        <div className="grid grid-cols-3">
            <p><b>Status:</b></p><p className="columns-count-2">{ data.status }</p>
            { data.filename ? <span><p><b>File Name:</b></p><p>{ data.filename }</p></span> : null } 
            { data.delivery_timestamp ? <span><p><b>Timestamp:</b></p><p>{ data.delivery_timestamp }</p></span> : null }
            { data.file_size ? <span><p><b>File Size:</b></p><p>{ data.file_size.toLocaleString() } bytes</p></span> : null }
            { data.hash ? <span><p><b>MD5 Hash:</b></p><p>{ data.hash }</p></span> : null }
            { data.file_count ? <span><p><b>File Count:</b></p><p>{ data.file_count }</p></span> : null }
        </div>
    );
}

const EFCTable : React.FC<{ data : EFCRow[] }> = ({data}) => {
    const [statusModalIsOpen, setModalIsOpen] = useState(false);
    const [statusModalContent, setStatusModalContent] = useState<EFCRow>();
    const [filterStr, setFilterStr] = useState("");
    const organizedData : Record<string, Record<string, Record<string, EFCRow>>> = {};

    // Order by client name, file type
    data.forEach(item => {
        // Hash map with structure [client_name, [file_type, [process_date, record]]]
        if (!organizedData[item.client_name])
            organizedData[item.client_name] = {};
        if (!organizedData[item.client_name][item.file_type])
            organizedData[item.client_name][item.file_type] = {};
        let process_timestamp : Date = new Date(Date.parse(item.process_timestamp));
        let process_date : Date = new Date(process_timestamp.getFullYear(), process_timestamp.getMonth(), process_timestamp.getDate());
        if (!organizedData[item.client_name][item.file_type][process_date.toDateString()])
            organizedData[item.client_name][item.file_type][process_date.toDateString()] = item;
    });
    const dateArr = generateDays();
    const handleFilterStr = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterStr(e.target.value);
    }

    return (
        <div className="data-table-container">
            <Input placeholder='Filter' value={filterStr} onChange={handleFilterStr}/>
            <table className="data-table">
                <thead className="data-table-header">
                    <tr>
                        { (data) ? <th>Client</th> : null }
                        { (data) ? <th>File Type</th> : null }
                        { dateArr.map(item => <th>{ item.toDateString() }</th>)}
                    </tr>
                </thead>
                <tbody className="data-table-body">
                {
                    Object.keys(organizedData).map(clientName => {
                        const fileTypes = Object.keys(organizedData[clientName]);
                        const rowspan = fileTypes.length;
                        return fileTypes.filter((fileType) => { 
                            if (filterStr === "") return true;
                            else if (fileType.toLowerCase().includes(filterStr.toLowerCase())) return true;
                            else return false;
                        }).map((fileType, index) => (                            
                            <tr key={fileType}>
                                { index === 0 && <td className="data-table-client-name" rowSpan={rowspan}>{clientName}</td>}
                                <td className="data-table-file-type">{ fileType }</td>
                                {dateArr.map(headerDate => {
                                    const statusItem = organizedData[clientName][fileType][headerDate.toDateString()];
                                    const status = statusItem ? statusItem.status : 'NO DATA';

                                    return (
                                    <td key={headerDate.toISOString()} style={{ backgroundColor: getColorForStatus(status) }} onClick={
                                        () => {
                                            setModalIsOpen(prevState => !prevState);
                                            (statusItem) ? setStatusModalContent(statusItem) : null;
                                        }
                                    }>
                                        {status}
                                    </td>
                                    );
                                })}
                            </tr>
                        ))
                    })
                }
                </tbody>
            </table>
            <Model title="File Details" isOpen={statusModalIsOpen} onClickClose={() => {setModalIsOpen(statusModalIsOpen => !statusModalIsOpen)}}>
                { (statusModalContent) ? modalContent(statusModalContent) : <p></p>}
            </Model>
        </div>
    );
};

export default EFCTable;