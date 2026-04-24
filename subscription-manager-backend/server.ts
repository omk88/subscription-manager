import express, {Request, Response} from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
})