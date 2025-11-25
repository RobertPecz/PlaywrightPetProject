import * as fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

class FileReaderHelper {

    /**
     * Getting the personal access token from file.
     * 
     * @param patFilePath - The path of the personal access token txt file.
     * 
     * @returns The string from the pat file.
     */
    readPat(patFilePath: string): string {
        const token = process.env.PAT;

        if (token) {
            console.log('Using GitHub Action token');
            return token;
        }

        // Local development fallback:
        console.warn('GITHUB_TOKEN not found — reading PAT from file');
        const patFromFile = fs.readFileSync(patFilePath, 'utf-8');
        return patFromFile.trim();
    }

    /**
     * Getting an excel data from an excel file defined sheet.
     * 
     * @param sheetName - The name of the sheet where the files are.
     * @param cellLetter - The letter of the cell (column) between 'A' and the last letter of the sheet.
     * @param cellNumber - The number of the cell (row) between '1' and the last letter of the sheet.
     * 
     * @returns - If the cell is not empty the function returns a string. If the cell is empty return undefined.
     */
    readTestCaseExcelFile(sheetName: string, cellLetter: string, cellNumber: string) {
        try {
            const filePath = path.resolve(process.cwd(), 'testcases/automation_practice_testcases.xlsx');
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

    /**
     * Getting multiple cell values based on the titles (keys) and bodies (values).
     * 
     * @param sheetName - The name of the sheet where the files are.
     * @param titleCellLetter - The letter of the title (key) between 'A' and the last letter of the sheet.
     * @param bodyCellLetter - The letter of the body (value) between 'A' and the last letter of the sheet.
     * 
     * @returns An object array with the structure of key-value pair based on the title and body parameters.
     */
    readMultipleTestCases(sheetName: string, titleCellLetter: string, bodyCellLetter: string): object[] {
        try {          
            const filePath = path.resolve(__dirname, '../testcases/automation_practice_testcases.xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[sheetName];

            //Getting all of the cell column based on the @titleCellLetter and take out the first 7 cell. It's not used for testcases in the testcases.xlsx.
            const sanitizedResultTitle = Object.keys(sheet).filter(key => key.startsWith(titleCellLetter)).slice(7);

            //Getting all of the cell column based on the @bodyCellLetter and take out the first 7 cell. It's not used for testcases in the testcases.xlsx.
            const sanitizedResultBody = Object.keys(sheet).filter(key => key.startsWith(bodyCellLetter)).slice(7);

            //Putting the @sanitizedResultTitle and the @sanitizedResultBody collections and put it into an array as key-value pairs.
            const sanitizedResult = sanitizedResultTitle.map((sanitizedResultTitle, i) => ({
                title: sheet[sanitizedResultTitle]?.h,
                body: sheet[sanitizedResultBody[i]]?.h
            }));

            return sanitizedResult;
        } 
        catch (error) {
            throw Error(error)
        } 
    }
}

export default FileReaderHelper;