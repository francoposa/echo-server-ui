'use client';

import React, { useState } from 'react';

interface FormData {
  textField: string;
}

const App: React.FC = () => {
  const [textFieldValue, setTextFieldValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (textFieldValue.trim() === '') {
      alert('Please enter some text before submitting.');
      return;
    }

    try {
      const responseData = await submitFormToApi({ textField: textFieldValue });
      // Handle success
      console.log('Form submitted successfully:', responseData);
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
    }
  };

  const submitFormToApi = async (requestData: FormData): Promise<any> => {
    const apiUrl = 'https://example.com/api/submit';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  };

  return (
      <div>
        <form>
          <label htmlFor="textField">Enter Text:</label>
          <input
              type="text"
              id="textField"
              name="textField"
              value={textFieldValue}
              onChange={handleInputChange}
              required
          />
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
  );
};

export default App;
