import * as fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

class FileReaderHelper {
    readPat(patFilePath: string):string {
        
        return fs.readFileSync(patFilePath, 'utf-8');
    }

    readTestCasesExcelFile(sheetName: string, cellNumber: string) {
        try {
            const filePath = path.resolve(__dirname, '../testcases/automation_practice_testcases.xlsx');
            const obj = XLSX.readFile(filePath);
            const sheet = obj.Sheets[sheetName];
            const data = sheet[cellNumber];
            return data['h']; 
        } 
        catch (error) {
            throw Error(error)
        }
    }
}

export default FileReaderHelper;