import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Step 1: Redirect user to ClickUp's OAuth URL
app.get("/auth/clickup", (req, res) => {
  const authUrl = `https://app.clickup.com/api?client_id=${
    process.env.CLICKUP_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://api.clickup.com/api/v2/oauth/token",
      {
        client_id: process.env.CLICKUP_CLIENT_ID,
        client_secret: process.env.CLICKUP_CLIENT_SECRET,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    res.send(`
      <h2>✅ ClickUp OAuth Successful!</h2>
      <p>Your Access Token:</p>
      <code>${accessToken}</code>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error exchanging code for token");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
