/**
 * This JavaScript code provides functions to generate and verify JSON Web Tokens (JWTs) using a secret
 * key.
 * @param username - The `username` parameter is a string that represents the username of the user for
 * whom the token is being generated or verified.
 * @param permission - The `permission` parameter is a string that represents the user's permission
 * level. It can be any value that describes the level of access or privileges that the user has.
 * @param expire - The `expire` parameter is the expiration time for the token. It specifies how long
 * the token will be valid for. It should be provided as a string in a format that can be parsed by the
 * `jsonwebtoken` library, such as `'1h'` for 1 hour, `'7d
 * @returns The code exports three functions: `generateToken`, `verifyToken`, and `getUsername`.
 */
const jwt = require('jsonwebtoken')
require("dotenv").config();

const secretKey = process.env.SECRET_KEY

/**
 * The function generates a token using the provided username, permission, and expiration time.
 * @param username - The username parameter is a string that represents the username of the user for
 * whom the token is being generated.
 * @param permission - The "permission" parameter is a string that represents the level of access or
 * authorization that the user has. It could be something like "admin", "user", or "guest", depending
 * on the specific requirements of your application.
 * @param expire - The `expire` parameter is a string that represents the expiration time of the token.
 * It specifies how long the token will be valid for.
 * @returns a Promise that resolves to a token.
 */
function generateToken(username, permission, expire) {
    try {
        if (typeof username !== 'string' || typeof permission !== 'string' || typeof expire !== 'string') {
            throw new Error('Invalid input parameters');
        }
        const payload = { username: username, permission: permission };
        const options = { expiresIn: expire };
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secretKey, options, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    } catch (error) {
        throw new Error(error.message);
    }
}


/**
 * The function `verifyToken` is used to verify the validity of a JSON Web Token (JWT) by checking its
 * expiration time.
 * @param token - The `token` parameter is a string that represents a JSON Web Token (JWT). It is the
 * token that needs to be verified for its validity.
 * @returns a boolean value. If the token is valid and has not expired, it will return true. If the
 * token is invalid or has expired, it will return false.
 */
async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, secretKey);
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if the 'exp' (expiration) claim exists in the decoded token and is a valid number
        if (typeof decoded.exp === 'number') {
            // Compare the expiration time with the current time to check if the token is still valid
            return decoded.exp > currentTime;
        } else {
            // If the 'exp' claim is missing or invalid, return false (token is not valid)
            console.error('Invalid or missing "exp" claim in the token:', decoded);
            return false;
        }
    } catch (err) {
        // Handle JWT verification errors
        console.error('Error verifying token:', err.message);
        return false;
    }
}


/**
 * The function `getUsername` decodes a JSON Web Token (JWT) and returns the username claim if it
 * exists and is a string, otherwise it logs an error and returns null.
 * @param t - The parameter `t` represents the token that needs to be decoded and verified. It is
 * expected to be a string containing a JSON Web Token (JWT).
 * @returns the username decoded from the token if it is a string. If the "username" claim is missing
 * or not a string, it will log an error message and return null. If there is an error verifying the
 * token, it will log the error message and also return null.
 */
async function getUsername(t) {
    try {
        const decoded = await jwt.verify(t, secretKey);
        if (typeof decoded.username === 'string') {
            return decoded.username;
        } else {
            console.error('Invalid or missing "username" claim in the token:', decoded);
            return null; // Return a default value (or throw an error if you prefer)
        }
    } catch (err) {
        console.error('Error verifying token:', err.message);
        return null; // Return a default value (or throw an error if you prefer)
    }
}

/**
 * The function generates a new access token using the provided token's username and returns it.
 * @param token - The `token` parameter is the existing access token that you want to generate a new
 * access token for.
 * @returns the `accessToken` generated by the `generateToken` function.
 */
async function generateNewAccessToken(token) {
    try {
        const accessToken = await generateToken(getUsername(token), 'user', '1h')
        return accessToken;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = { generateToken, verifyToken, getUsername, generateNewAccessToken }
