import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from 'axios';
import querystring from 'querystring';
 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const shop = process.env.SHOP_DOMAIN;

// 👉 Step 1. Homepage - Auto “Continue with Shopify” link
app.get('/', (req, res) => {
  res.send(`
    <h1>Shopify OAuth Login Demo</h1>
    <a href="/auth/shopify">
      <button style="padding:10px 20px; font-size:16px;">Continue with Shopify</button>
    </a>
  `);
});

// 👉 Step 2. Redirect to Shopify OAuth Authorization URL
app.get('/auth/shopify', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const scopes = 'read_products,read_orders';

  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

  res.redirect(authUrl);
});

// 👉 Step 3. Handle Callback and Exchange Code for Access Token
app.get('/api/auth/callback/shopify', async (req, res) => {
  const { code, hmac } = req.query;

  if (!code || !hmac) {
    return res.status(400).send('Missing required parameters.');
  }

  // --- Verify HMAC ---
  const params = { ...req.query };
  delete params['signature'];
  delete params['hmac'];
  const message = querystring.stringify(params);
  const generatedHmac = crypto
    .createHmac('sha256', process.env.CLIENT_SECRET)
    .update(message)
    .digest('hex');

  if (generatedHmac !== hmac) {
    return res.status(400).send('HMAC validation failed');
  }

  try {
    // --- Exchange code for access token ---
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access Token:', accessToken);

    // --- Get shop (store) details ---
    const shopResponse = await axios.get(`https://${shop}/admin/api/2025-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken
      }
    });

    res.send(`
      <h2>Access Token Received ✅</h2>
      <h3>Shop Details:</h3>
      <pre>${JSON.stringify(shopResponse.data, null, 2)}</pre>
    `);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).send('Error during token exchange or fetching shop info.');
  }
});

// Add this route to test the access token
app.get('/test-token', async (req, res) => {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
; // Your token
  
  try {
    const response = await axios.get(`https://${shop}/admin/api/2024-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken
      }
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});




app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
