import { APIRequestContext } from '@playwright/test';

class ApiHandler {

    readonly request: APIRequestContext;

    /**
     * Passing the ApiRequestContext, it can passed the Playwright request.
     */
    constructor(request: APIRequestContext) {
        this.request = request;
        
    }

    /**
     * If the response including lot of data it's going to paginated in every 30 elements. The function validate that the response include next pagination endpoint.
     * 
     * @param response - The response object which holds the next page endpoint if there any.
     * 
     * @returns If there are a next page it's going to return the endpoint which is going to point to the next page. If there are no next page it's going to return undefined
     */
    getHeaderPagination(response: Object) {
        const headers = response['_headers']['_headersArray'];
        
        //Getting the response header Link value.
        let linkHeaderValue: string = headers.find((header: { name: string; }) => header.name === "Link")?.value;

        //If the @linkHeaderValue has the 'rel="next"' substring and the linkHeaderValue not undefined it's going to getting the raw endpoint.
        if(linkHeaderValue.includes('rel="next"') && linkHeaderValue !== undefined) {
            const sanitizedLink: string = linkHeaderValue.substring(1, linkHeaderValue.length - 13);
            return sanitizedLink;
        }
        return undefined;
    }

    /**
     * Listing the Github issues.
     * @param endpoint - The endpoint where the request goes.
     * @param apiVersion - Github api version. Currently the newest is 2022-11-28.
     * @param contentType - Github api content-type. Currently is application/json.
     * @param authorization - Github autorization. Currently using personal acces token, the syntax is: token+pat
     * @returns - ApiResponse object which held the metadata about the issues.
     */
    async listIssues(endpoint: string, apiVersion: string, contentType: string, authorization: string) {
        const issues = await this.request.get(endpoint, {
            headers: { 
                'X-GitHub-Api-Version': apiVersion, 
                'content-type': contentType, 
                'Authorization': authorization
            }
        });
        return issues;
    }

    /**
     * Posting an issue on Github.
     * @param endpoint - The endpoint where the request goes.
     * @param apiVersion - Github api version. Currently the newest is 2022-11-28.
     * @param contentType - Github api content-type. Currently is application/json.
     * @param authorization - Github autorization. Currently using personal acces token, the syntax is: token+pat
     * @param title - The title of the issue.
     * @param body - The description of the issue as raw string.
     * @param assignees - The assignees, it accepts multiple elements.
     * @param labels - The labels, it accepts multiple elements.
     * @returns - ApiResponse object which held the metadata about the issue.
     */
    async postIssue(endpoint: string, apiVersion: string, contentType: string, authorization: string, title: string, body: string, assignees: string, labels: string) {
        const issue = await this.request.post(endpoint, {
            headers: { 
                'X-GitHub-Api-Version': apiVersion, 
                'content-type': contentType, 
                'Authorization': authorization
            },
            data: {
                title: title,
                body: body,
                assignees: assignees,
                labels: labels
            }
        })
        return issue;
    }
}

export default ApiHandler;