import { useEffect, useState } from 'react'
import LithicEmbediFrame from './LithicEmbediFrame'
import PlaidConnector from './PlaidLink';
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
  const [isCreating, setIsCreating] = useState(false);

  const [cardData, setCardData] = useState({pan: '', expiry: '', cvv: ''});

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

  const handleCreateCard = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:3001/api/cards', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const newCard = await response.json();
      
      setCards((prevCards) => [newCard, ...prevCards]);
    } catch (error) {
      console.error("Error creating new card:", error);
      alert("Could not create a new card. Check the console for details.");
    } finally {
      setIsCreating(false);
    }
  };

    const handleLinkCard = async () => {
      console.log("Creating card", cardData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setCardData({
    ...cardData,
    [e.target.name]: e.target.value
    });
  };

  return (
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
        <h1>Cards</h1>
        <button 
          onClick={handleCreateCard} 
          disabled={isCreating}
          style={{
            padding: '10px 20px',
            backgroundColor: isCreating ? '#ccc' : '#007bff',
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
              <div key={card.token} className="card-container" style={{
                border: '1px solid #ddd',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '8px',
                textAlign: 'left'
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>
                  {card.memo || "Unnamed Card"} (****{card.last_four})
                </h3>
                <LithicEmbediFrame cardToken={card.token} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App