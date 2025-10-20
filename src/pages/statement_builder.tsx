import { useState } from "react";
import PasteBox from "../components/PasteBox";
import Input from "../components/Input";
import SectionTitle from "../components/SectionTitle";
import Button from "../components/Button";

const SNOWFLAKE_KEY_WORDS = ["GROUP", "ORDER", "WHERE", "TO", "CLASS"]

function StatementBuilder() {
    const [clientName, setClientName] = useState("")
    const [tableName, setTableName] = useState("")
    const [statement, setStatement] = useState("")

    function moveNumbersToBack(field: string) {
        const charArrField = field.split('');
        const numbersInField = [];
      
        let count = 0;
        let index = 0;
        while (!isNaN(parseInt(charArrField[index]))) {
          numbersInField.push(charArrField[index]);
          index++;
          count++;
        }
      
        const newField = charArrField.slice(count).join('');
        return newField.replace("_", "") + '_' + numbersInField.join('');
    }

    function toSnowflakeField(field: string) {
        if (field.includes("`")) {
          field = field.replace(/`/g, '');
        }
      
        if (field.includes(" ")) {
          field = field.replace(/ /g, '_');
        }
      
        if (field.includes("-")) {
          field = field.replace(/-/g, '_');
        }

        if (SNOWFLAKE_KEY_WORDS.includes(field))
        field = field + "_";
      
        if (!isNaN(parseInt(field.charAt(0)))) {
          field = moveNumbersToBack(field);
        }
      
        return field.toUpperCase();
    }

    function convertToCreateTable(input: string): string {
        if (input.length === 0) {
            return ""
        }
        const schemaMap = new Map<string, number>()
        const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '');
        const columnNames = lines[0].split(/\s+/g)
        const columnLengths = lines[1].split(/\s+/g)

        columnNames.forEach((columnName, index) => schemaMap.set(columnName, columnLengths[index].length))

        const columns = lines.slice(2).map(line => {
            let startIndex = 0;
            const columnValues = columnNames.map((columnName, index) => {
                const columnLength = schemaMap.get(columnName) ?? 0
                const value = line.substring(startIndex, startIndex + columnLength).trim().toUpperCase()
                const columnValue: string = index === 0 ? toSnowflakeField(value) : value

                startIndex += columnLength + 2

                return transformColumnValue(columnValue);
        
            })
            return columnValues.join(" ").trim()
        })

        return `CREATE TABLE ${clientName + "_" + tableName.toUpperCase()} (\n\t${columns.join(',\n\t')}\n);`
    }

    function transformColumnValue(value: string) : string | null {
        let clean: string | null = value

        if (value.includes(") UNSIGNED")) {
            clean = value.split(" ")[0]
        }

        if (clean.includes("1900-01-01 00:00:00")) {
            console.log(clean)
        }

        if (clean === "PRI") {
            return "PRIMARY KEY"
        }
        else if (clean.match(/BIGINT\(\d/)) {
            return clean.replace("BIGINT", "NUMBER")
        } 
        else if (clean.match(/DECIMAL\(\d/)) {
            return clean.replace("DECIMAL", "NUMBER")
        } 
        else if (clean.match(/INT\(\d/)) {
            return clean.replace("INT", "NUMBER")
        } 
        else if (clean.match(/BIGINT\(\d/)) {
             return clean.replace("BIGINT", "NUMBER")
        } 
        else if (clean === "NO") {
            return "NOT NULL"
        } 
        else if (clean === "DATETIME" || clean === "TIMESTAMP") {
            return "TIMESTAMP_NTZ(9)"
        } 
        else if (
            clean === "AUTO_INCREMENT" || 
            clean === "CURRENT_TIMESTAMP" || 
            clean === "ON UPDATE CURRENT_TIMESTAMP" || 
            clean === "MUL" || 
            clean === "(NULL)" || 
            clean === "YES" ||
            clean === "1900-01-01 00:00:00" ||
            clean === "0.00" ||
            clean === "0"
        ) {
            return null
        }
        return clean;
    }

    const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(convertToCreateTable(statement))
	}

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Input 
                    id="client-name" 
                    label="Client Name" 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)} 
                />
                <Input 
                    id="table-name" 
                    label="Table Name" 
                    value={tableName} 
                    onChange={e => setTableName(e.target.value)} 
                />
                <PasteBox value={statement} onChange={e => setStatement(e.target.value)}/>
            </div>
            <div className="bg-slate-200 rounded-lg px-3">
                <div className="border-bottom mt-5 d-flex align-items-center justify-content-between">
                    <SectionTitle text="Output">
                        <div>
                            <Button onClick={handleCopyToClipboard}>Copy</Button>
                        </div>
                    </SectionTitle>

                </div>
                <div className="overflow-x-auto">
                    <code>
                        <pre>
                            {convertToCreateTable(statement)}
                        </pre>
                    </code>
                </div>
            </div>
        </div>
    )
}

export default StatementBuilder;