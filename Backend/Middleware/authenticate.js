/**
 * The code defines middleware functions to check if a token is blacklisted and authenticate access and
 * refresh tokens in an Express.js application.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information about the request, such as the request headers, request body, request
 * method, request URL, and more. It is used to access and manipulate the incoming request data.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. You can use it to send JSON responses, redirect the client to a different
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to the final route handler.
 * @returns In the `checkBlacklist` function, if either the access token or the refresh token is
 * blacklisted, a response with a status code of 401 and an error message will be returned.
 */
const { verify } = require('jsonwebtoken')
const jwt = require('../JWT/jwt')
const revokedToken = new Set();


/**
 * The function `checkBlacklist` checks if the access token or refresh token is blacklisted and returns
 * an error response if it is, otherwise it continues to the next middleware.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information about the request, such as the request headers, request body, request
 * method, request URL, and more.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the
 * response back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically called at the end of the current
 * middleware function to indicate that it has completed its processing and the next middleware
 * function should be executed.
 * @returns If either the access token or the refresh token is blacklisted, a response with a status
 * code of 401 and an error message will be returned. If neither token is blacklisted, the function
 * will call the next middleware.
 */
function checkBlacklist(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (blacklistedTokens.has(accessToken)) {
        return res.status(401).json({ error: 'Access token is revoked. Authorization denied.' });
    }

    if (blacklistedTokens.has(refreshToken)) {
        return res.status(401).json({ error: 'Refresh token is revoked. Authorization denied.' });
    }

    // If the token is not blacklisted, continue to the next middleware
    next();
}

/**
 * The function `authenticateAccessToken` checks if an access token is present in the request cookies,
 * verifies it, and if valid, calls the next middleware function; otherwise, it falls back to the
 * `authenticateRefreshToken` function.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and cookies.
 * @param res - The `res` parameter is the response object in Node.js. It is used to send the HTTP
 * response back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to the final route handler.
 * @returns If the `accessToken` is not found, a response with status code 401 and an error message
 * will be returned. If the `accessToken` is found and successfully verified, the `next()` function
 * will be called to proceed to the next middleware. If there is an error while verifying the
 * `accessToken`, the `authenticateRefreshToken` function will be called.
 */
async function authenticateAccessToken(req, res, next) {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).json({ error: 'No token found. Authorization denied.' })
    }

    try {
        if (verify(accessToken)) {
            next()
        } else {
           const response = await authenticateRefreshToken(req, res, next)
           req.customData = { accessToken: response };
           next()
        }
    } catch (error) {
        console.error("Error verifying the access Token:", error.message)
        authenticateRefreshToken(req, res, next)
    }
}

/**
 * The function `authenticateRefreshToken` checks if a refresh token exists in the request cookies, and
 * if it does, verifies its validity before calling the next middleware function; otherwise, it returns
 * an error response.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and body.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the HTTP
 * response back to the client.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to the final route handler.
 * @returns In this code, if there is no refreshToken found in the request cookies, a response with
 * status code 401 and an error message "No token found. Authorization denied." will be returned.
 */
async function authenticateRefreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ error: 'No token found. Authorization denied.' })
    }

    try {
        if (verify(refreshToken)) {
            return await jwt.generateNewAccessToken(refreshToken)
        } else {
            return res.status(401).json({ error: 'Token is invalid. Authorization denied.' });
        }
    } catch (error) {
        console.error("Error verifying the access Token:", error.message)
    }
}

module.exports = { authenticateAccessToken, authenticateRefreshToken, checkBlacklist }