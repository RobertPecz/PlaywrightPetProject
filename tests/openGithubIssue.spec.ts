import { test, expect } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json'
import FileReaderHelper from '../support/filereader';

test('list issues', async({request}) => {
    const patInput = 'pat';
    const issues = await request.get(githubApiData.endpoint, {
        headers: { 'X-GitHub-Api-Version': '2022-11-28', 'content-type': 'application/vnd.github.raw+json', 'Authorization': 'patinput' }
    });
    
    const response = JSON.parse(await issues.text());
    console.log(response);

    const readPatFromFile = new FileReaderHelper();

    const pat = readPatFromFile.readPat('pat.txt');
});