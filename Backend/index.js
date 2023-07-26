/* The above code is a Node.js application using the Express framework. It sets up a server that
listens for HTTPS requests on a specified port. The server handles various routes for user
authentication and note management. */
const express = require('express');
require("dotenv").config();
const rateLimit = require('express-rate-limit');
const https = require('https')
const fs = require('fs')
const db = require('./Database/database')
const encrypt = require("./Encrypt/encrypt")
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticateMiddleware = require('./Middleware/authenticate');
const { error } = require('console');
const jwt = require('./JWT/jwt')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
});

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
};

app.use(limiter);

/* The `app.post('/signup', async (req, res) => { ... })` function is a route handler for the HTTP POST
request to the '/signup' endpoint. */
app.post('/signup', async (req, res) => {
    const formData = req.body;

    try {
        if (!formData.username) throw new error("no username given")
        const passwordData = await encrypt.hashPassword(formData.password);
        const result = await db.queryDatabase("INSERT INTO users (username, password) VALUES ($1, $2)", [formData.username, passwordData.hashedPassword]);
        res.json({ success: true, result: result, strength: passwordData.strength });
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/* The `app.post('/login', async (req, res) => { ... })` function is a route handler for the HTTP POST
request to the '/login' endpoint. */
app.post('/login', async (req, res) => {
    const formData = req.body;

    try {
        // Check if the user exists in the database
        const user = await db.queryDatabase('SELECT users.username, users.password FROM users WHERE username=$1', [formData.username]);
        if (user.length === 0) {
            throw new Error("Invalid username or password");
        }

        // Verify the password
        const validPassword = await encrypt.checkPassword(formData.password, user[0].password);

        if (!validPassword.success) {
            throw new Error("Invalid username or password");
        }

        // Generate tokens and send the response
        const accessToken = jwt.generateToken(formData.username, 'user', '1h');
        const refreshToken = jwt.generateToken(formData.username, 'user', '7d');
        res.json({ login: true, accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(401).json({ login: false, error: "Invalid username or password" });
    }
});

/* The `app.get("/notes", authenticateMiddleware.checkBlacklist,
authenticateMiddleware.authenticateAccessToken, async (req, res) => { ... })` function is a route
handler for the HTTP GET request to the '/notes' endpoint. */
app.get("/notes", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async (req, res) => {

    try {
        const username = jwt.getUsername(req.cookies.accessToken)
        const result = await db.queryDatabase("SELECT n.id n.title, n.content, n.created_at FROM notes n WHERE username=$1", [username])
        res.json({ result: result })
    } catch (error) {
        console.error("Error getting notes:", error.message)
        res.status(401).json({ error: 'Error getting notes for user' })
    }
})

/* The `app.get("/getnote/:id", authenticateMiddleware.checkBlacklist,
authenticateMiddleware.authenticateAccessToken, async (req, res) => { ... })` function is a route
handler for the HTTP GET request to the '/getnote/:id' endpoint. */
app.get("/getnote/:id", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async (req, res) => {
    const id = req.params.id;

    try {
        const username = jwt.getUsername(req.cookies.accessToken)
        const result = await db.queryDatabase("SELECT n.id n.title, n.content, n.created_at FROM notes n WHERE username=$1 and id=$2", [username, id])
        res.json({ result: result })
    } catch (error) {
        console.error("Error getting notes:", error.message)
        res.status(401).json({ error: 'Error getting notes for user' })
    }
})

/* The `app.post("/createnote", ...)` function is a route handler for the HTTP POST request to the
'/createnote' endpoint. */
app.post("/createnote", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async (req, res) => {
    const formData = req.body
    try {
        if (!formData.title) {
            throw new Error("No title entered")
        }
        const username = jwt.getUsername(req.cookies.accessToken)
        const result = await db.queryDatabase('INSERT INTO notes (username, title, content) VALUES ($1, $2, $3)', [username, formData.title, formData.content])
        res.json({ result: result })
    } catch (error) {
        console.error("Error creating note:", error.message)
        res.status(401).json({ error: error.message })
    }
})

/* The `app.put("/updatenote", ...)` function is a route handler for the HTTP PUT request to the
'/updatenote' endpoint. It is responsible for updating a note in the database. */
app.put("/updatenote", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async (req, res) => {
    const formData = req.body;

    try {
        if (!formData.title) {
            throw new Error("No title entered");
        }
        const username = jwt.getUsername(req.cookies.accessToken)
        const result = await db.queryDatabase('UPDATE notes SET title=$1, content=$2 WHERE username=$3 AND id=$4', [formData.title, formData.content, username, formData.id]);
        res.json({ result: result });
    } catch (error) {
        console.error("Updating notes error:", error.message);
        res.status(401).json({ error: error.message });
    }
});

/* The `app.delete("/deletenote/:id", ...)` function is a route handler for the HTTP DELETE request to
the '/deletenote/:id' endpoint. It is responsible for deleting a note from the database. */
app.delete("/deletenote/:id", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async (req, res) => {
    const id = req.params.id;
    try {
        const username = jwt.getUsername(req.cookies.accessToken)
        const result = await db.queryDatabase('DELETE FROM notes WHERE id=$1 and username=$2',[id, username]);
        res.json({ result: result });
    } catch (error) {
        console.error("Error deleting note:", error.message);
        res.status(401).json({ error: error.message });
    }
})

/* The `app.post("/share", ...)` function is a route handler for the HTTP POST request to the '/share'
endpoint. It is responsible for sharing a note with another user. */
app.post("/share", authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async(req, res) => {
    const id = req.formData.body.id
    const share = req.formData.body.share

    try {
        const result = db.queryDatabase('INSERT INTO shared_notes (note_id, shared_with_user_id) VALUES ($1, $2)', [id, share])
        res.json({ result: result });
    } catch (error) {
        console.error("Error share note", error.message)
        res.status(401).json({error: error.message})
    }
})

/* The code `app.get('/search/:keywords', authenticateMiddleware.checkBlacklist,
authenticateMiddleware.authenticateAccessToken, async(req, res) => { ... })` is defining a route
handler for the HTTP GET request to the '/search/:keywords' endpoint. */
app.get('/search/:keywords', authenticateMiddleware.checkBlacklist, authenticateMiddleware.authenticateAccessToken, async(req, res) => {
    const keywords = req.params.keywords

    try {
        const result = db.queryDatabase('SELECT n.title, n.content FROM notes where content LIKE $1', [`%${keywords}%`])
        res.json({ result: result });
    } catch (error) {
        console.error("Error searching note", error.message)
        res.status(401).json({error: error.message})
    }
})



https.createServer(options, app).listen(parseInt(process.env.PORT), () => {
    console.log(`Server running on port ${parseInt(process.env.PORT)}`);
});

module.exports = app;