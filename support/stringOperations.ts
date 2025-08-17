class StringOperations {

    /**
     * Preparing the @title and create a sentence from it which is going to post it on Github.
     * 
     * @param title - The input parameter @title which is going to used in the sentence.
     * 
     * @returns The sentence string which is including the @title. 
     */
    createTestcaseTitle(title: string): string {
        return 'Testcase:' + ' ' + title;
    }

    /**
     * Preparing the @body and the @expectedResult create a sentence from it which is going to post it on Github.
     * 
     * @param body - The input parameter @body which is going to used in the sentence.
     * @param expectedResult - The input parameter @expectedResult which is going to used in the sentence.
     * @returns The sentence string which is including the @body and the @expectedResult.
     */
    createTestCaseBody(body: string, expectedResult: string): string {
        return 'Write testcase' + ' ' + body.toLocaleLowerCase() + '\n\nExpected result:' + ' ' + expectedResult;
    }
}

export default StringOperations;