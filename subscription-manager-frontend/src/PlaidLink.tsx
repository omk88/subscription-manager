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
      const response = await axios.post('http://localhost:3001/api/create_link_token');
      setLinkToken(response.data.link_token);
    };
    generateToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
    await axios.post('/api/exchange_public_token', {
      public_token: public_token,
    });
    console.log('Success! Card connected.');
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </button>
  );
};

export default PlaidConnector;