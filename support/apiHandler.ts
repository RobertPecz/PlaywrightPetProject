class ApiHandler {

    getHeaderPagination(response: Object) {
        const headers = response['_headers']['_headersArray'];
        
        let linkHeaderValue: string = headers.find((header: { name: string; }) => header.name === "Link")?.value;
        const sanitizedLink: string = linkHeaderValue.substring(1, linkHeaderValue.length - 13);
        if(linkHeaderValue.endsWith('rel="prev"')) {
            return undefined;
        }
        return sanitizedLink;
    }

}

export default ApiHandler;