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
    const account_id = metadata.accounts[0].id;

    const plaidResponse = await axios.post('http://localhost:3001/api/plaid/exchange_public_token', {
      public_token: public_token,
      account_id: account_id, 
    });

    const { processor_token } = plaidResponse.data;

    const lithicResponse = await axios.post('http://localhost:3001/api/lithic/funding_source', {
      processor_token: processor_token
    });

    console.log('Success! Bank linked to Lithic:', lithicResponse.data);
    alert("Bank account successfully linked as your funding source!");

  } catch (error) {
    console.error("Error in the bank linking flow:", error);
    alert("Failed to link bank account. Check console for details.");
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