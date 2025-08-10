class ApiHandler {

    getHeaderPagination(response: Object) {
        const headers = response['_headers']['_headersArray'];
        let linkHeaderValue: string = headers.find((header: { name: string; }) => header.name === "Link")?.value;

        if(linkHeaderValue.includes('rel="next"') && linkHeaderValue !== undefined) {
            const sanitizedLink: string = linkHeaderValue.substring(1, linkHeaderValue.length - 13);
            return sanitizedLink;
        }
        return undefined;
    }

}

export default ApiHandler;