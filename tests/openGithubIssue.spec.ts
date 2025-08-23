import { test, expect, APIResponse } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json';
import FileReaderHelper from '../support/filereader';
import StringOperations from '../support/stringOperations';
import TestcasesFilter from '../support/testcasesFilter';
import ApiHandler from '../support/apiHandler';

const PatName = 'pat.txt'

test('list issues', async({ request }) => {

    const readPatFromFile: FileReaderHelper = new FileReaderHelper();
    const apiHandler: ApiHandler = new ApiHandler(request);
    const pat: string = readPatFromFile.readPat(PatName);

    const issues: APIResponse = await apiHandler.
    listIssues(
        githubApiData.baseEndpoint + githubApiData.endpoint,
        githubApiData.apiversion,
        githubApiData.contentType,
        githubApiData.authorization + ' ' + pat
    );
    
    const response: Array<string> = JSON.parse(await issues.text());
    
    expect(issues.status()).toBe(200);
    expect(response[0]['url']).toEqual(expect.stringContaining(githubApiData.baseEndpoint));
    expect(response[0]['title']).toBeTruthy();
    expect(response[0]['assignees'][0]['login']).toEqual(githubApiData.assignee);
});

[
    { name: 'Login and register' },
    { name: 'Buy product' },
    { name: 'Other' }
].forEach(({name}) => {
    test(`create issues from ${name} sheet`, async({request}) => {
        const readPatFromFile: FileReaderHelper = new FileReaderHelper();
        const apiHandler: ApiHandler = new ApiHandler(request);
        const stringOperations: StringOperations = new StringOperations();
        const testcasesFilter: TestcasesFilter = new TestcasesFilter();
        const pat: string = readPatFromFile.readPat(PatName);
        const issues: APIResponse[] = [];
        let response: string[] = [];
        let endpointCollection: string[] = [githubApiData.baseEndpoint + githubApiData.endpoint]
        let excelData: object[] = readPatFromFile.readMultipleTestCases(`${name}`, 'C', 'E');

        //Getting all of the open issues from Github.
        for (let index = 0; index < endpointCollection.length; index++) {
            issues.push(await apiHandler.listIssues(
                endpointCollection[index],
                githubApiData.apiversion,
                githubApiData.contentType,
                githubApiData.authorization + ' ' + pat));

            //If there are next page, fetch that page as well.
            let nextEndpoint: string | undefined = apiHandler.getHeaderPagination(issues[index]);
            if(typeof nextEndpoint === "string") {
                endpointCollection.push(nextEndpoint);
            }
        }         

        //Getting all the Github issues response text and put it in a single string array.
        response = (await Promise.all(issues.map(issue => issue.text().then(JSON.parse)))).flat();
        let issuesNotOnGithub: object[] = testcasesFilter.compareIsTitleAlreadyOpenedOnGithub(response, excelData);
        
        //Loop through the whole @issuesNotOnGithub and POST it to Github to the PlaywrightPetProject project.
        for (let index = 0; index < issuesNotOnGithub.length; index++) {

            const responsePostGithub = await apiHandler.postIssue(
                githubApiData.baseEndpoint + githubApiData.endpoint,
                githubApiData.apiversion,
                githubApiData.contentType,
                githubApiData.authorization + ' ' + pat,
                stringOperations.createTestcaseTitle(issuesNotOnGithub[index]['title']),
                stringOperations.createTestCaseBody(issuesNotOnGithub[index]['title'], issuesNotOnGithub[index]['body']),
                githubApiData.assignee,
                githubApiData.labels[0]
            )

            //Validate the result.
            const responseText = JSON.parse(await responsePostGithub.text());

            expect(responsePostGithub.status()).toBe(201);
            expect(responseText['url']).toContain(githubApiData.baseEndpoint);
            expect(responseText['body']).toContain(issuesNotOnGithub[index]['body']);
            expect(responseText['assignees'][0]['login']).toEqual(githubApiData.assignee);
            expect(responseText['state']).toEqual('open');           
        }
    });
});