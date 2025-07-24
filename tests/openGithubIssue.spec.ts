import { test, expect } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json'
import FileReaderHelper from '../support/filereader';
import StringOperations from '../support/stringOperations';

const PatName = 'pat.txt'

test('list issues', async({request}) => {

    const readPatFromFile = new FileReaderHelper();
    const pat = readPatFromFile.readPat(PatName);

    const issues = await request.get(githubApiData.endpoint, {
        headers:{ 
            'X-GitHub-Api-Version': '2022-11-28', 
            'content-type': 'application/vnd.github.raw+json', 
            'Authorization': `token ${pat}`
        }
    });
    
    const response = JSON.parse(await issues.text());
    console.log(response);
});

test('create issues', async({request}) => {
    const readPatFromFile = new FileReaderHelper();
    const stringOperations = new StringOperations();
    const pat = readPatFromFile.readPat(PatName);
    const sheetName = 'Other'
    let line = 11;
    let title = readPatFromFile.readTestCasesExcelFile(sheetName, 'C', line.toString());
    let body = readPatFromFile.readTestCasesExcelFile(sheetName, 'E', line.toString());

    while(title !== undefined && body !== undefined) {
        const response = await request.post(githubApiData.endpoint, {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28', 
                'content-type': 'application/vnd.github.raw+json', 
                'Authorization': `token ${pat}`
            },
            data: {
                title: stringOperations.createTestcaseTitle(title),
                body: stringOperations.createTestCaseBody(title, body),
                assignees: ['RobertPecz'],
                labels: ['enhancement']
            }

        })

        console.log(response.status());
        line++;

        title = readPatFromFile.readTestCasesExcelFile(sheetName, 'C', line.toString());
        body = readPatFromFile.readTestCasesExcelFile(sheetName, 'E', line.toString());
    }
    console.log('End run');
})