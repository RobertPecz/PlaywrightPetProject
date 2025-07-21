import { test, expect } from '@playwright/test';
import githubApiData from '../fixtures/githubAPIData.json'
import FileReaderHelper from '../support/filereader';
import StringOperations from '../support/stringOperations';

test('list issues', async({request}) => {

    const readPatFromFile = new FileReaderHelper();
    const pat = readPatFromFile.readPat('pat.txt');

    const issues = await request.get(githubApiData.endpoint, {
        headers:{ 
            'X-GitHub-Api-Version': '2022-11-28', 
            'content-type': 'application/vnd.github.raw+json', 
            'Authorization': `${pat}`
        }
    });
    
    const response = JSON.parse(await issues.text());
    console.log(response);
});

test('create issues', async({request}) => {
    const readPatFromFile = new FileReaderHelper();
    const pat = readPatFromFile.readPat('pat.txt');

    const stringOperations = new StringOperations();
    
    const response = await request.post(githubApiData.endpoint, {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28', 
            'content-type': 'application/vnd.github.raw+json', 
            'Authorization': `${pat}`
        }

    })
})