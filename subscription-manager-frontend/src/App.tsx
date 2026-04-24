import { useEffect, useState } from 'react'
import LithicEmbediFrame from './LithicEmbediFrame'
import './App.css'

interface LithicCard {
  token: string;
  memo: string;
  last_four: string;
  state: string;
}

function App() {
  const [cards, setCards] = useState<LithicCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/cards');
        
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

  return (
    <div className="App">
      <h1>My Subscriptions</h1>
      
      {loading ? (
        <p>Loading cards...</p>
      ) : (
        <div className="card-list">
          {cards.map(card => (
            <div key={card.token} className="card-container">
              <h3>{card.memo} (****{card.last_four})</h3>
              <LithicEmbediFrame cardToken={card.token} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App