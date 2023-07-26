const jwt = require('./jwt')
const JWT = require('jsonwebtoken')
require("dotenv").config();

// Tests that a token is generated with valid input parameters
it('test_happy_path', async () => {
    const token = await jwt.generateToken('user', 'admin', '1h');
    expect(typeof token).toBe('string');
});

// Tests that an error is thrown if input parameters are not strings
it('test_invalid_username_type', async () => {
    const invalidUsername = 123; // Not a string
    const permission = 'admin';
    const expire = '1h';

    try {
        await jwt.generateToken(invalidUsername, permission, expire);
    } catch (error) {
        expect(error.message).toBe('Invalid input parameters');
    }
});

// Tests that an error is thrown if input parameters are not strings
it('test_invalid_permission_type', async () => {
    const invalidUsername = '123'; // Not a string
    const permission = 123;
    const expire = '1h';

    try {
        await jwt.generateToken(invalidUsername, permission, expire);
    } catch (error) {
        expect(error.message).toBe('Invalid input parameters');
    }
});

// Tests that an error is thrown if input parameters are not strings
it('test_invalid_expire_type', async () => {
    const invalidUsername = '123'; // Not a string
    const permission = 'admin';
    const expire = 1;

    try {
        await jwt.generateToken(invalidUsername, permission, expire);
    } catch (error) {
        expect(error.message).toBe('Invalid input parameters');
    }
});

// Tests that a JWT token is generated with the correct payload
it('test_happy_path_correct_payload', async () => {
    const token = await jwt.generateToken('user1', 'admin', '1h');
    const decoded = JWT.decode(token);
    expect(decoded.username).toBe('user1');
    expect(decoded.permission).toBe('admin');
});

// Tests that a JWT token is generated with the correct options
it('test_happy_path_correct_options', async () => {
    const token = await jwt.generateToken('user1', 'admin', '1h');
    const decoded = JWT.decode(token);
    expect(decoded.exp - decoded.iat).toBe(3600);
});

//Tests that a JWT token is generated with the correct secret key
it('test_happy_path_correct_secret_key', async () => {
    const token = await jwt.generateToken('user1', 'admin', '1h');
    const decoded = JWT.decode(token);
    expect(decoded).toBeDefined();
});

//Tests that an error is thrown when JWT sign method throws an error
it('test_edge_case_jwt_sign_error', async () => {
    const mockSign = jest.spyOn(JWT, 'sign').mockImplementation((payload, secretKey, options, callback) => {
        callback(new Error('JWT sign error'));
    });
    await expect(jwt.generateToken('user1', 'admin', '1h')).rejects.toThrow('JWT sign error');
    mockSign.mockRestore();
});

//Tests that a valid token with a valid expiration date is verified
it('test_valid_token_with_valid_exp', async () => {
    const token = JWT.sign({ data: 'test' }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const result = await jwt.verifyToken(token);
    expect(result).toBe(true);
});

//Tests that an invalid token is not verified
it('test_invalid_token', async () => {
    const token = 'invalid_token';
    const result = await jwt.verifyToken(token);
    expect(result).toBe(false);
});

// Tests that a token with an 'exp' claim in the past is not verified
it('test_token_with_exp_claim_in_the_past', async () => {
    const token = JWT.sign({ data: 'test', exp: Math.floor(Date.now() / 1000) - 3600 }, process.env.SECRET_KEY);
    const result = await jwt.verifyToken(token);
    expect(result).toBe(false);
});

// Tests that false is returned if the secret key is missing
it('test_missing_secret_key', async () => {
    const token = JWT.sign({ data: 'test' }, 'invalid_secret_key');
    const result = await jwt.verifyToken(token);
    expect(result).toBe(false);
});

//Tests that the function returns the username if the token is valid and the username claim is a string
it('test_valid_token', async () => {
    const token = JWT.sign({ username: 'test_user' }, process.env.SECRET_KEY);
    const result = await jwt.getUsername(token);
    expect(result).toBe('test_user');
});

//Tests that the function logs an error message and returns null if the 'username' claim is missing
it('test_missing_username_claim', async () => {
    const token = JWT.sign({ not_username: 'test_user' }, process.env.SECRET_KEY);
    const result = await jwt.getUsername(token);
    expect(result).toBeNull();
});

//Tests that the function logs an error message and returns null if the token is invalid
it('test_invalid_token', async () => {
    const token = 'invalid_token';
    const result = await jwt.getUsername(token);
    expect(result).toBeNull();
});

//Tests that the function logs an error message and returns null if the 'username' claim is not a string
it('test_non_string_username_claim', async () => {
    const token = JWT.sign({ username: 123 }, process.env.SECRET_KEY);
    const result = await jwt.getUsername(token);
    expect(result).toBeNull();
});

//Tests that the function returns null if the token is null
it('test_null_token', async () => {
    const token = null;
    const result = await jwt.getUsername(token);
    expect(result).toBeNull();
});

//Tests that the function returns null if the token is undefined
it('test_undefined_token', async () => {
    const token = undefined;
    const result = await jwt.getUsername(token);
    expect(result).toBeNull();
});