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
    const [loading, setLoading] = useState(false);

    const handleReveal = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const { nonce } = await stripe.createEphemeralKeyNonce({
                issuingCard: cardId,
            });

            const response = await fetch(`http://localhost:3001/api/stripe/cards/${cardId}/reveal`);
            
            if (!response.ok) throw new Error('Failed to fetch ephemeral key');
            
            const ephemeralKey = await response.json();
            
            setData({ 
                nonce, 
                ephemeralKeySecret: ephemeralKey.secret 
            });
        } catch (err) {
            console.error("Reveal error:", err);
            alert("Could not reveal card details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reveal-section" style={{ marginTop: '15px' }}>
            {!data ? (
                <button 
                    onClick={handleReveal} 
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Securing Connection...' : 'Reveal Card Details'}
                </button>
            ) : (
                <div className="virtual-card-details" style={{ 
                    background: '#2d2d2d', 
                    color: 'white', 
                    padding: '20px', 
                    borderRadius: '12px',
                    fontFamily: 'monospace'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <small style={{ color: '#aaa' }}>CARD NUMBER</small>
                        <IssuingCardNumberDisplayElement 
                            options={{ 
                                issuingCard: cardId, 
                                nonce: data.nonce, 
                                ephemeralKeySecret: data.ephemeralKeySecret,
                                style: { base: { color: '#ffffff', fontSize: '18px' } }
                            }} 
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                            <small style={{ color: '#aaa' }}>EXPIRY</small>
                            <IssuingCardExpiryDisplayElement 
                                options={{ 
                                    issuingCard: cardId, 
                                    nonce: data.nonce, 
                                    ephemeralKeySecret: data.ephemeralKeySecret,
                                    style: { base: { color: '#ffffff' } }
                                }} 
                            />
                        </div>
                        <div>
                            <small style={{ color: '#aaa' }}>CVC</small>
                            <IssuingCardCvcDisplayElement 
                                options={{ 
                                    issuingCard: cardId, 
                                    nonce: data.nonce, 
                                    ephemeralKeySecret: data.ephemeralKeySecret,
                                    style: { base: { color: '#ffffff' } }
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StripeCardReveal;