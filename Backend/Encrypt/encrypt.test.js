const Encrypt = require('./encrypt')
const bcrypt = require('bcrypt');
// Tests that a valid password is hashed successfully
it('test_valid_password_hashed_successfully', async () => {
    const password = 'StrongPassword123!';
    const result = await Encrypt.hashPassword(password);
    expect(result.hashedPassword).toBeDefined();
});

// Tests that password strength is returned correctly
it('test_password_strength_returned_correctly', async () => {
    const password = 'StrongPassword123!';
    const result = await Encrypt.hashPassword(password);
    expect(result.strength).toBeDefined();
});

/* This code is testing that when an empty password is passed to the `Encrypt.hashPassword()` function,
it throws an error with the message 'Invalid password'. The test uses the
`expect().rejects.toThrow()` syntax to assert that the function call should throw an error with the
specified message. */
it('test_empty_password_throws_error', async () => {
    const password = '';
    await expect(Encrypt.hashPassword(password)).rejects.toThrow('Invalid password');
});

/* This code is testing that when a non-string password is passed to the `Encrypt.hashPassword()`
function, it throws an error with the message 'Invalid password'. The test uses the
`expect().rejects.toThrow()` syntax to assert that the function call should throw an error with the
specified message. */
it('test_non_string_password_throws_error', async () => {
    const password = 12345;
    await expect(Encrypt.hashPassword(password)).rejects.toThrow('Invalid password');
});

/* This code is testing that when a password containing only whitespace characters is passed to the
`Encrypt.hashPassword()` function, it throws an error with the message 'Invalid password'. The test
uses the `expect().rejects.toThrow()` syntax to assert that the function call should throw an error
with the specified message. */
it('test_whitespace_password_throws_error', async () => {
    const password = '   ';
    await expect(Encrypt.hashPassword(password)).rejects.toThrow('Invalid password');
});

/* This code is testing that when a weak password is passed to the `Encrypt.hashPassword()` function,
it throws an error with the message 'Password is too weak. Please choose a stronger password.'. The
test uses the `expect().rejects.toThrow()` syntax to assert that the function call should throw an
error with the specified message. */
it('test_weak_password_throws_error', async () => {
    const password = 'wW!2';
    await expect(Encrypt.hashPassword(password)).rejects.toThrow('Password is too weak. Please choose a stronger password.');
});

/* This code is testing the `Encrypt.checkPassword()` function to ensure that it correctly compares a
given password with a hashed password and returns the expected result. */
it('test_valid_password', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Encrypt.checkPassword(password, hashedPassword);
    expect(result).toEqual({ success: true, message: 'Password is correct' });
});

/* This code is testing the `Encrypt.checkPassword()` function to ensure that it correctly compares a
given password with a hashed password and returns the expected result. It sets a password and hashes
it using bcrypt, then calls the `Encrypt.checkPassword()` function with the original password and
the hashed password. It expects the result to be an object with the properties `success` set to
`true` and `message` set to 'Password is correct'. */
it('test_password_matches_hashed_password', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Encrypt.checkPassword(password, hashedPassword);
    expect(result).toEqual({ success: true, message: 'Password is correct' });
});

/* The code is testing the scenario where the `Encrypt.checkPassword()` function is called with null
values for both the password and hashedPassword parameters. It expects that calling the function
with these null values will throw an error with the message 'Error comparing passwords'. The test
uses a try-catch block to catch any errors thrown by the function and then uses the
`expect().toBe()` syntax to assert that the error message matches the expected value. */
it('test_missing_input_parameters', async () => {
    try {
        await Encrypt.checkPassword(null, null);
    } catch (error) {
        expect(error.message).toBe('Error comparing passwords');
    }
});

/* This code is testing the scenario where the `Encrypt.checkPassword()` function is called with a
password that does not match the hashed password. */
it('test_password_does_not_match_hashed_password', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash('wrong_password', 10);
    const result = await Encrypt.checkPassword(password, hashedPassword);
    expect(result).toEqual({ success: false, message: 'Password is incorrect' });
});

/* The code `it('test_invalid_input_parameters', async () => { ... })` is a test case that checks the
behavior of the `Encrypt.checkPassword()` function when called with invalid input parameters. */
it('test_invalid_input_parameters', async () => {
    try {
        await Encrypt.checkPassword();
    } catch (error) {
        expect(error.message).toBe('Error comparing passwords');
    }
});

/* The code `it('test_compare_throws_error', async () => { ... })` is a test case that checks the
behavior of the `Encrypt.checkPassword()` function when an error is thrown during the comparison of
the password and hashed password. */
it('test_compare_throws_error', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new Error('bcrypt.compare error');
    });
    try {
        await Encrypt.checkPassword(password, hashedPassword);
    } catch (error) {
        expect(error.message).toBe('Error comparing passwords');
    }
});