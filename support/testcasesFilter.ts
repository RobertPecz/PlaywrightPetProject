class TestcasesFilter {
    compareIsTitleAlreadyOpenedOnGithub(response: string[], excelData: object[]): string[] {
        //Rework this to accept object[]
        const sanitizedArray = response
            .filter(item => Array.isArray(item['labels']) && item['labels'].length > 0)
            .map(item => item['title']);

        const testcasesNotOnGithub = titles.filter(
            title => !sanitizedArray.some(s => s.replace(/^Testcase:\s*/, "") === title));
            
        return testcasesNotOnGithub;
    }
}

export default TestcasesFilter;