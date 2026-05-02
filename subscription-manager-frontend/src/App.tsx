import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardReveal from './StripeCardReveal'; 
import PlaidConnector from './PlaidLink';
import './App.css'

const stripePromise = loadStripe('pk_test_51TSby33HKKLUqqOYymSKygZmOgauDxjIJZlkZ9jRAEHx2eCsMSKqqynL8KA5tPzshZ4M5unsudLdpZ9fedQAwmOt00NGQiuC8b');

interface StripeCard {
  id: string;     
  last4: string; 
  metadata: {
    memo?: string;
  };
  status: string;
}

function App() {
  const [cards, setCards] = useState<StripeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stripe/cards');
        
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const json = await response.json();
        setCards(json); 
        
      } catch (error) {
        console.error("Failed to fetch from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleCreateCard = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:3001/api/stripe/cards', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const newCard = await response.json();
      setCards((prevCards) => [newCard, ...prevCards]);
    } catch (error) {
      console.error("Error creating new card:", error);
      alert("Could not create a new card.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <PlaidConnector />
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '20px',
          borderBottom: '1px solid #eee' 
        }}>
          <h1>Stripe Issuing Cards</h1>
          <button 
            onClick={handleCreateCard} 
            disabled={isCreating}
            style={{
              padding: '10px 20px',
              backgroundColor: isCreating ? '#ccc' : '#635bff', // Stripe Blue
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isCreating ? 'Generating...' : '+ Create New Card'}
          </button>
        </header>
        
        {loading ? (
          <p>Loading cards...</p>
        ) : (
          <div className="card-list">
            {cards.length === 0 ? (
              <p>No cards found. Create one to get started!</p>
            ) : (
              cards.map(card => (
                <div key={card.id} className="card-container" style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  margin: '10px 0',
                  borderRadius: '8px',
                  textAlign: 'left',
                  background: '#f8f9fa'
                }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    {card.metadata.memo || "Virtual Card"} (****{card.last4})
                  </h3>
                  
                  {/* Replace Lithic component with Stripe Reveal component */}
                  <StripeCardReveal cardId={card.id} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Elements>
  )
}

export default App