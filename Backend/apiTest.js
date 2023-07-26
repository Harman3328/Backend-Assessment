const https = require ("https");
const axios = require ("axios");

async function testSignup() {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.post("https://localhost:3001/signup", {
      username: "john",
      password: "Assassin'sCreed2023!",
    }, {
      httpsAgent: agent,
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    }
  }
}
