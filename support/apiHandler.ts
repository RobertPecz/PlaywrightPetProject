class ApiHandler {

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
}

export default ApiHandler;