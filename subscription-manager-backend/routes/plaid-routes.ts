import express, { Request, Response } from 'express';
import { Products, CountryCode, ProcessorTokenCreateRequestProcessorEnum } from 'plaid';
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

router.post('/exchange_public_token', async (req, res) => {
  try {
    const { public_token, account_id } = req.body; 

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({ 
        public_token 
    });
    const accessToken = exchangeResponse.data.access_token;

    const processorRequest = {
      access_token: accessToken,
      account_id: account_id,
      processor: ProcessorTokenCreateRequestProcessorEnum.Lithic,
    };

    const processorResponse = await plaidClient.processorTokenCreate(processorRequest);
    const processorToken = processorResponse.data.processor_token;

    res.json({ processor_token: processorToken });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create processor token' });
  }
});

export default router;