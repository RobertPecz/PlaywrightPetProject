class TestcasesFilter {
    compareIsTitleAlreadyOpenedOnGithub(response: string[], titles: string[]): string[] {
        let sanitizedArray: string[] = [];
        for (let index = 0; index < response.length; index++) {
            if(response[index]['labels'].length !== 0){
                sanitizedArray.push(response[index]['title']);          
            }
        }
            //const sanitizedArray = response.map(element => element['title'].substring(10));
            //const a = sanitizedArray.filter(item => !titles.includes(item));
            const testcasesNotOnGithub = titles.filter(item => !sanitizedArray.includes(item))
            
            return testcasesNotOnGithub;
        }
}

export default TestcasesFilter;