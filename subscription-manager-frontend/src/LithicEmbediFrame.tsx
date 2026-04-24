import { useState } from 'react'

function LithicEmbediFrame({ cardToken }: { cardToken: string }) {
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);

    const handleReveal = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/cards/${cardToken}/embed`);
            const data = await response.json();
            
            console.log("Tokens received:", data);

            if (!data.embed_request || !data.hmac) {

                console.log(`DATA:hmac: ${data.hmac}`);
                console.error("Missing tokens in response!");
                return;
            }

            const url = `https://sandbox.lithic.com/v1/embed/card?embed_request=${encodeURIComponent(data.embed_request)}&hmac=${encodeURIComponent(data.hmac)}`;
            
            console.log(`URL: ${url}`);

            console.log(`DATA:hmac: ${data.hmac}`);

            setEmbedUrl(url);
        } catch (error) {
            console.error("Failed to fetch embed URL:", error);
        }

    };

    return (
        <div style={{ marginTop: '10px' }}> 
            {!embedUrl ? (
                <button onClick={handleReveal}>Reveal Card Details</button>
            ) : (
                <iframe
                    src={embedUrl}
                    title="Card Details"
                    style={{ border: 'none', width: '100%', height: '120px' }}
                />
            )}
        </div>
    );
}

export default LithicEmbediFrame;