import { useState } from 'react';
import { 
  useStripe, 
  useElements, 
  IssuingCardNumberDisplayElement,
  IssuingCardCvcDisplayElement,    
  IssuingCardExpiryDisplayElement  
} from '@stripe/react-stripe-js';


function StripeCardReveal({ cardId }: { cardId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [data, setData] = useState<any>(null);

    const handleReveal = async () => {
        const { nonce } = await stripe!.createEphemeralKeyNonce({
            issuingCard: cardId,
        });

        const response = await fetch('/api/stripe/cards/reveal', {
            method: 'POST',
            body: JSON.stringify({ cardId, nonce })
        });
        const { ephemeralKeySecret } = await response.json();
        
        setData({ nonce, ephemeralKeySecret });
    };

    return (
        <div>
            {!data ? (
                <button onClick={handleReveal}>Reveal Details</button>
            ) : (
                <div className="virtual-card">
                    { }
                    <label>Card Number</label>
                    <IssuingCardNumberDisplayElement 
                        options={{ issuingCard: cardId, nonce: data.nonce, ephemeralKeySecret: data.ephemeralKeySecret }} 
                    />
                    
                    <label>Expiry</label>
                    <IssuingCardExpiryDisplayElement 
                        options={{ issuingCard: cardId, nonce: data.nonce, ephemeralKeySecret: data.ephemeralKeySecret }} 
                    />
                </div>
            )}
        </div>
    );
}