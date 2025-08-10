import * as fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

class FileReaderHelper {
    readPat(patFilePath: string):string {
        
        return fs.readFileSync(patFilePath, 'utf-8');
    }

    readTestCaseExcelFile(sheetName: string, cellLetter: string, cellNumber: string) {
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

    readMultipleTestCases(sheetName: string, titleCellLetter: string, bodyCellLetter: string): object[] {
        try {          
            const filePath = path.resolve(__dirname, '../testcases/automation_practice_testcases.xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[sheetName];

            const sanitizedResultTitle = Object.keys(sheet).filter(key => key.startsWith(titleCellLetter)).slice(7);

            const sanitizedResultBody = Object.keys(sheet).filter(key => key.startsWith(bodyCellLetter)).slice(7);

            const sanitizedResult = sanitizedResultTitle.map((sanitizedResultTitle, i) => ({
                title: sheet[sanitizedResultTitle]?.h,
                body: sheet[sanitizedResultBody[i]]?.h
            }));
            //validate the result!!!!!!
            return sanitizedResult;
        } 
        catch (error) {
            throw Error(error)
        } 
    }
}

export default FileReaderHelper;