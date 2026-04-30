import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();
const LITHIC_API_KEY = process.env.LITHIC_API_KEY;
const LITHIC_BASE_URL = 'https://sandbox.lithic.com/v1';

router.get('/cards', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${LITHIC_BASE_URL}/cards`, {
            headers: { 'Authorization': `api-key ${LITHIC_API_KEY}` }
        });
        res.json(response.data.data);
    } catch (error: any) {
        console.error("Lithic Fetch Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch cards from Lithic." });
    }
});

router.post('/cards', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${LITHIC_BASE_URL}/cards`,
            {
                type: 'SINGLE_USE',
                memo: `New Card ${new Date().toLocaleDateString()}`,
                spend_limit: 1000 
            },
            {
                headers: { 'Authorization': `api-key ${LITHIC_API_KEY}` }
            }
        );
        res.json(response.data);
    } catch (error: any) {
        console.error("Lithic Creation Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create card." });
    }
});

router.get('/cards/:token/embed', async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const embedObject = { token: token }; 
        const jsonString = JSON.stringify(embedObject); 

        const hmac = crypto
            .createHmac('sha256', LITHIC_API_KEY || "")
            .update(jsonString)
            .digest('base64');

        const embed_request = Buffer.from(jsonString).toString('base64');

        res.json({
            embed_request: embed_request,
            hmac: hmac
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate embed credentials." });
    }
});

router.post('/funding_source', async (req, res) => {
  try {
    const { processor_token } = req.body;

    const response = await axios.post(
      `${LITHIC_BASE_URL}/financial_accounts`,
      {
        token: processor_token, 
        type: 'CHECKING',
        account_name: 'Primary Funding Source'
      },
      {
        headers: { 'Authorization': `api-key ${LITHIC_API_KEY}` }
      }
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to link funding source to Lithic' });
  }
});

export default router;