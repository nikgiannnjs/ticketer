import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL;
function App() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/hello`);
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError('Failed to fetch message');
        console.error('Error:', err);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>MVP Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{message || 'Loading...'}</p>
      )}
    </div>
  );
}

export default App; 
