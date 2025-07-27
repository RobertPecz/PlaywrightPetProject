import { test, expect, APIResponse } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json'
import FileReaderHelper from '../support/filereader';
import StringOperations from '../support/stringOperations';

const PatName = 'pat.txt'

test('list issues', async({request}) => {

    const readPatFromFile: FileReaderHelper = new FileReaderHelper();
    const pat: string = readPatFromFile.readPat(PatName);

    const issues: APIResponse = await request.get(githubApiData.endpoint, {
        headers:{ 
            'X-GitHub-Api-Version': '2022-11-28', 
            'content-type': 'application/vnd.github.raw+json', 
            'Authorization': `token ${pat}`
        }
    });
    
    const response: Array<string> = JSON.parse(await issues.text());
    
    await expect(issues.status()).toBe(200);
    await expect(response[0]['url']).toEqual(expect.stringContaining(githubApiData.endpoint));
    await expect(response[0]['body']).toBeTruthy();
    await expect(response[0]['assignees'][0]['login']).toEqual(githubApiData.assignee);
    await expect(response[0]['state']).toEqual('open');
});

[
    { name: 'Login and register' },
    { name: 'Buy product' },
    { name: 'Other' }
].forEach(({name}) => {
    test(`create issues from ${name} sheet`, async({request}) => {
        const readPatFromFile: FileReaderHelper = new FileReaderHelper();
        const stringOperations: StringOperations = new StringOperations();
        const pat: string = readPatFromFile.readPat(PatName);
        let line: number = 11;
        let titles: Array<string> = readPatFromFile.readMultipleTestCases(`${name}`, 'C');
        let bodies: Array<string> = readPatFromFile.readMultipleTestCases(`${name}`, 'E');
        let title: string | never = readPatFromFile.readTestCaseExcelFile(`${name}`, 'C', line.toString());
        let body: string | never = readPatFromFile.readTestCaseExcelFile(`${name}`, 'E', line.toString());

        const issues: APIResponse = await request.get(githubApiData.endpoint, {
            headers: { 
                'X-GitHub-Api-Version': '2022-11-28', 
                'content-type': 'application/vnd.github.raw+json', 
                'Authorization': `token ${pat}`
            }
        });
    
        const response: Array<string> = JSON.parse(await issues.text()); // <-- Compare titles and bodies is in the array. If yes, don't go into the loop.

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

            await expect(response.status()).toBe(201);
            await expect(response[0]['url']).toEqual(expect.stringContaining(githubApiData.endpoint));
            await expect(response[0]['body']).toBeTruthy();
            await expect(response[0]['assignees'][0]['login']).toEqual(githubApiData.assignee);
            await expect(response[0]['state']).toEqual('open');

            title = readPatFromFile.readTestCaseExcelFile(`${name}`, 'C', line.toString());
            body = readPatFromFile.readTestCaseExcelFile(`${name}`, 'E', line.toString());
        }
        console.log('End run');
    });
});