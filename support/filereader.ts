import * as fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

class FileReaderHelper {
    readPat(patFilePath: string):string {
        
        return fs.readFileSync(patFilePath, 'utf-8');
    }

    readTestCasesExcelFile(sheetName: string, cellLetter: string, cellNumber: string) {
        try {
            const filePath: string = path.resolve(__dirname, '../testcases/automation_practice_testcases.xlsx');
            const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
            const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
            
            const data: object = sheet[cellLetter + cellNumber];

            if (data !== undefined) {
                return data['h']; 
            }
            return data;
        } 
        catch (error) {
            throw Error(error)
        }
    }
}

export default FileReaderHelper;