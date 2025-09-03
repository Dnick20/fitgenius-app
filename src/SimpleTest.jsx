import React, { useState } from 'react';

function SimpleTest() {
  const [showTest, setShowTest] = useState(false);

  if (showTest) {
    return (
      <div style={{ padding: '50px', backgroundColor: 'green', color: 'white', fontSize: '24px' }}>
        <h1>SUCCESS! State change worked!</h1>
        <button onClick={() => setShowTest(false)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', backgroundColor: 'blue', color: 'white', fontSize: '24px' }}>
      <h1>Simple Test Page</h1>
      <button 
        onClick={() => {
          console.log('Button clicked!');
          setShowTest(true);
        }}
        style={{ padding: '20px', fontSize: '18px' }}
      >
        Test Button
      </button>
    </div>
  );
}

export default SimpleTest;