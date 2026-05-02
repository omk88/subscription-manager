import express, { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.get('/cards', async (req: Request, res: Response) => {
    try {
        const cards = await stripe.issuing.cards.list({ limit: 10 });
        res.json(cards.data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/cards', async (req: Request, res: Response) => {
    try {
        const cardholderId = 'ich_1TScIc3HKKLUqqOYSv1hThTe'; 

        const card = await stripe.issuing.cards.create({
            cardholder: cardholderId,
            currency: 'gbp',
            type: 'virtual',
            status: 'active',
        });
        res.json(card);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cards/:id/reveal', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { issuing_card: id },
            { apiVersion: '2022-11-15' } 
        );
        res.json(ephemeralKey);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;