import { useEffect, useState } from 'react'
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
          throw new Error('Network response was not ok');
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
        <pre style={{ textAlign: 'left', background: '#222', color: '#fff', padding: '10px' }}>
          {JSON.stringify(cards, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App