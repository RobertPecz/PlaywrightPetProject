import { test, expect, APIResponse } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json'
import FileReaderHelper from '../support/filereader';
import StringOperations from '../support/stringOperations';
import HeaderHelper from '../support/apiHandler';
import TestcasesFilter from '../support/testcasesFilter';
import ApiHandler from '../support/apiHandler';

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
    { name: 'Login and register' }
    /*{ name: 'Buy product' },
    { name: 'Other' }*/
].forEach(({name}) => {
    test(`create issues from ${name} sheet`, async({request}) => {
        const readPatFromFile: FileReaderHelper = new FileReaderHelper();
        const apiHandler: ApiHandler = new ApiHandler();
        const testcasesFilter: TestcasesFilter = new TestcasesFilter();
        const pat: string = readPatFromFile.readPat(PatName);
        const issues: APIResponse[] = [];
        let response: string[] = [];

        let line: number = 11;
        let endpointCollection: string[] = [githubApiData.endpoint]
        let titles: Array<string> = readPatFromFile.readMultipleTestCases(`${name}`, 'C');
        let bodies: Array<string> = readPatFromFile.readMultipleTestCases(`${name}`, 'E');
        let title: string | never = readPatFromFile.readTestCaseExcelFile(`${name}`, 'C', line.toString());
        let body: string | never = readPatFromFile.readTestCaseExcelFile(`${name}`, 'E', line.toString());

        for (let index = 0; index < endpointCollection.length; index++) {
            issues.push(await request.get(endpointCollection[index], {
                headers: { 
                    'X-GitHub-Api-Version': '2022-11-28', 
                    'content-type': 'application/vnd.github.raw+json', 
                    'Authorization': `token ${pat}`
                }
                
            }));

            let nextEndpoint: string | undefined = apiHandler.getHeaderPagination(issues[index]);
            if(typeof nextEndpoint === "string") {
                endpointCollection.push(nextEndpoint);
            }
        }         

        for (let index = 0; index < issues.length; index++) {
            response.push(JSON.parse((await issues[index].text())));
            
        }

        response = response.flat();
        testcasesFilter.compareIsTitleAlreadyOpenedOnGithub(response, titles);
        //const response: Array<string> = JSON.parse(await issues[1].text()); // <-- Compare titles and bodies is in the array. If yes, don't go into the loop.


        /*for (let index = 0; index < difference.length; index++) {
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
        }

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
        }*/
        console.log('End run');
    });
});