/**
 * Generate a random string of specified length using alphanumeric characters.
 * @param length - The desired length of the random string.
 * @returns A random string of the specified length.
 */
export function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Generate a random email address.
 * @param isValid - If true, generates a valid email format (xxx@xxx.com). If false, generates an invalid format.
 * @returns A random email string.
 */
export function generateRandomEmail(isValid: boolean = true): string {
  if (isValid) {
    return generateRandomString(5) + '@' + generateRandomString(5) + '.com';
  }
  return generateRandomString(10);
}

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
