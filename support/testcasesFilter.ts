class TestcasesFilter {
    compareIsTitleAlreadyOpenedOnGithub(response: string[], titles: string[]): string[] {
            const sanitizedArray = response.map(element => element['title'].substring(10));
            //const a = sanitizedArray.filter(item => !titles.includes(item));
            const testcasesNotOnGithub = titles.filter(item => !sanitizedArray.includes(item))
            
            return testcasesNotOnGithub;
        }
}

export default TestcasesFilter;