/**
 * The code provides functions to hash and check passwords using bcrypt and enforce password strength
 * requirements.
 * @param password - The `password` parameter is the plain text password that you want to hash or check
 * against a hashed password.
 * @returns The code is exporting an object that contains two functions: `hashPassword` and
 * `checkPassword`.
 */
const bcrypt = require('bcrypt');
require("dotenv").config();
const zxcvbn = require('zxcvbn')

/**
 * The function `hashPassword` takes a password as input, checks its strength based on certain
 * criteria, and returns the hashed password along with a strength message.
 * @param password - The `password` parameter is the password that needs to be hashed.
 * @returns an object with two properties: "hashedPassword" and "strength". The "hashedPassword"
 * property contains the hashed version of the input password, while the "strength" property contains a
 * message indicating the strength of the password.
 */
async function hashPassword(password) {
    try {
        if (!password || typeof password !== 'string' || password.trim() === '') {
            throw new Error('Invalid password');
        }

        if (!/[a-z]/.test(password)) {
            throw new Error('Password must contain a lowercase character');
        }

        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain an uppercase character');
        }

        if (!/[~`!@#$%^&*,.]/.test(password)) {
            throw new Error('Password must contain a special character');
        }

        if (!/[0-9]/.test(password)) {
            throw new Error('Password must contain a number');
        }

        const passwordStrength = zxcvbn(password);
        if (passwordStrength.score < 3) {
            throw new Error('Password is too weak. Please choose a stronger password.');
        } else if (passwordStrength.score < 4) {
            strengthMessage = 'Password strength is medium.';
        } else {
            strengthMessage = 'Password strength is strong.';
        }

        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        return { hashedPassword: hash, strength: strengthMessage };
    } catch (error) {
        throw new Error(error.message);
    }
}


/**
 * The function `checkPassword` compares a given password with a hashed password and returns a success
 * message if they match, or an error message if they don't.
 * @param password - The `password` parameter is the plain text password that you want to check against
 * the hashed password.
 * @param hashedPassword - The `hashedPassword` parameter is the password that has been previously
 * hashed using a hashing algorithm, such as bcrypt. This is typically stored in a database or some
 * other form of persistent storage.
 * @returns an object with two properties: "success" and "message". The "success" property indicates
 * whether the password is correct or not, and the "message" property provides a message describing the
 * result.
 */
async function checkPassword(password, hashedPassword) {
    try {
        if (!password || !hashedPassword) {
            throw new Error('Invalid input parameters');
        }
        const result = await bcrypt.compare(password, hashedPassword);
        if (result) {
            return { success: true, message: 'Password is correct' };
        } else {
            return { success: false, message: 'Password is incorrect' };
        }
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}

module.exports = { hashPassword, checkPassword }; 