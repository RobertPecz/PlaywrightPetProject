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

    readMultipleTestCases(sheetName: string, cellLetter: string): Array<string> {
        try {
            const filePath: string = path.resolve(__dirname, '../testcases/automation_practice_testcases.xlsx');
            const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
            const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

            var result = Object.keys(sheet).filter(v => v.startsWith(cellLetter)).map(e => sheet[e]);

            return result.map(item => item.h);
        } 
        catch (error) {
            throw Error(error)
        } 
    }

    compareIsTitleAlreadyOpenedOnGithub(response: Array<string>, titles: Array<string>): Array<string> {
        const sanitizedArray = response.map(element => element['title'].substring(10));
        const a = sanitizedArray.filter(item => !titles.includes(item));
        const b = titles.filter(item => !sanitizedArray.includes(item))
        
        return b;
    }
}

export default FileReaderHelper;