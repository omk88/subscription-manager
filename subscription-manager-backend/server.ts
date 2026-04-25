import express, {Request, Response} from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

interface LithicCard {
    token: string;
    memo: string;
    last_four: string;
    state: string;
}

interface LithicResponse {
    data: LithicCard[];
}

// Generating a card with Lithic
app.get('/api/cards', async (request: Request, response: Response) => {
    try {
        const LITHIC_API_KEY = process.env.LITHIC_API_KEY;

        if (!LITHIC_API_KEY) {
            return response.status(500).json({error: "Missing API key in .env file."});
        }

        const axios_response = await axios.get<LithicResponse>('https://sandbox.lithic.com/v1/cards', {
            headers: {
                'Authorization': `api-key ${LITHIC_API_KEY}`
            }
        });

        response.json(axios_response.data.data);
    } catch (error) {
        console.error("Backend error:", error);
        response.status(500).json({error: "Failed to fetch cards from Lithic API."})
    }
});

// Embed iFrame to display card details using Lithic's embed feature
app.get('/api/cards/:token/embed', async (request: Request, response: Response) => {
    try {
        const { token } = request.params;
        const apiKey = process.env.LITHIC_API_KEY || "";

        const embedObject = { token: token }; 
        const jsonString = JSON.stringify(embedObject); 

        const hmac = crypto
            .createHmac('sha256', apiKey)
            .update(jsonString)
            .digest('base64');

        const embed_request = Buffer.from(jsonString).toString('base64');

        response.json({
            embed_request: embed_request,
            hmac: hmac
        });

    } catch (error) {
        response.status(500).json({ error: "Failed to generate local HMAC." });
    }
});

// Generate new card on Lithic and return the card details to the frontend
app.post('/api/cards', async (request: Request, response: Response) => {
    try {
        const LITHIC_API_KEY = process.env.LITHIC_API_KEY;

        const axios_response = await axios.post(
            'https://sandbox.lithic.com/v1/cards',
            {
                type: 'SINGLE_USE', 
                memo: `New Card ${new Date().toLocaleDateString()}`,
                spend_limit: 1000 
            },
            {
                headers: { 'Authorization': `api-key ${LITHIC_API_KEY}` }
            }
        );

        response.json(axios_response.data);
    } catch (error: any) {
        console.error("Error creating card:", error.response?.data || error.message);
        response.status(500).json({ error: "Failed to create card." });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
})