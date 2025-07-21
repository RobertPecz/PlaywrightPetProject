class StringOperations {

    createTestcaseTitle(title: string): string {
        return 'Testcase:' + title;
    }

    createTestCaseBody(body: string, expectedResult: string): string {
        return 'Write testcase' + body + '\n\nExpected result:' + expectedResult 
    }
}

export default StringOperations;