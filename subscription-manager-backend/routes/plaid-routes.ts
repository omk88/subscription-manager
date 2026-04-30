import express, { Request, Response } from 'express';
import { Products, CountryCode } from 'plaid';
import { plaidClient } from '../config/plaid'; 

const router = express.Router();

router.post('/create_link_token', async (req: Request, res: Response) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'unique_user_id' }, 
      client_name: 'Subscription Manager',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error("Plaid Link Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create link token" });
  }
});

router.post('/exchange_public_token', async (req: Request, res: Response) => {
  try {
    const { public_token } = req.body;
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });
    
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    console.log('--- Plaid Exchange Successful ---');
    console.log('Access Token:', accessToken);
    console.log('Item ID:', itemId);
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Plaid Token Exchange Failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

export default router;