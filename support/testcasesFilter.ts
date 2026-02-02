class TestcasesFilter {
  /**
   * Fetching the data from the Github and from the testcases.xlsx file and filter every test case out which is already opened on Github.
   *
   * @param response - The response presanitized titles from Github.
   * @param excelData - The title and body key-value pair.
   * @returns An object array which is including every titles and bodies which is in the excel file and not on Github.
   */
  compareIsTitleAlreadyOpenedOnGithub(
    response: Array<{ labels?: unknown[]; title?: unknown }>,
    excelData: Array<{ title?: string }>,
  ): Array<{ title?: string; body?: string }> {
    //If the labels are not zero getting the element title. The label filtering is a must because there are duplicate
    //response data if a merge request or other event related to that element.
    const sanitizedArray = response
      .filter((item) => Array.isArray(item.labels) && item.labels.length > 0 && typeof item.title === 'string')
      .map((item) => item.title as string);

    //Comparing every element in the excel data and from the response object title while the Testcase prefix is sliced.
    const testcasesNotOnGithub = excelData.filter(
      (item) => !sanitizedArray.some((t) => t.replace(/^Testcase:\s*/, '') === item.title),
    );

    return testcasesNotOnGithub;
  }
}

export default TestcasesFilter;
