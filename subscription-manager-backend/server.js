const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

const LITHIC_API_KEY = "b661879a-120e-4f40-ba0a-3a986dfe492a";

app.get('/api/cards', async (req, res) => {
  try {
    const response = await axios.get('https://sandbox.lithic.com/v1/cards', {
      headers: {
        'Authorization': `api-key ${LITHIC_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Lithic" });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));