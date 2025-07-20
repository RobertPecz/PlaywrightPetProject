import * as fs from 'fs';

class FileReaderHelper {
    readPat(patFilePath: string):string {
        
        return fs.readFileSync(patFilePath, 'utf-8');
    }
}

export default FileReaderHelper;