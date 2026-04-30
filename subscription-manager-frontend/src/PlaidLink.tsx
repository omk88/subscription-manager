import React, { useEffect, useState, useCallback } from 'react';
import { 
  usePlaidLink, 
  type PlaidLinkOptions, 
  type PlaidLinkOnSuccess 
} from 'react-plaid-link';
import axios from 'axios';

const PlaidConnector: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/plaid/create_link_token');        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    generateToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
    try {
      await axios.post('http://localhost:3001/api/plaid/exchange_public_token', {
        public_token: public_token,
      });
      console.log('Success! Card connected and token exchanged.');
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div style={{ textAlign: 'right', padding: '20px' }}>
      <button 
        onClick={() => open()} 
        disabled={!ready}
        style={{
          padding: '10px 20px',
          cursor: ready ? 'pointer' : 'not-allowed',
          backgroundColor: ready ? '#007bff' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        {ready ? 'Connect Bank Account' : 'Loading Plaid...'}
      </button>
    </div>
  );
};

export default PlaidConnector;