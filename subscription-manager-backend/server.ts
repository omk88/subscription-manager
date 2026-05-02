import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plaidRoutes from './routes/plaid-routes';
import stripeRoutes from './routes/stripe-routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/plaid', plaidRoutes);
app.use('/api/stripe', stripeRoutes); 

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(` - Plaid: http://localhost:${PORT}/api/plaid`);
    console.log(` - Stripe: http://localhost:${PORT}/api/stripe`);
});