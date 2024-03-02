'use client';

import React, { useState } from 'react';

interface FormData {
  textField: string;
}

const App: React.FC = () => {
  const [textInputValue, setTextInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (textInputValue.trim() === '') {
      alert('Please enter some text before submitting.');
      return;
    }

    try {
      const responseData = await submitFormToApi({ textField: textInputValue });
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
      <div className="container max-w-6xl border border-stone-200 bg-white font-mono">
          <div className="flex flex-row flex-wrap">
            <div className="basis-full text-center">
              <h1 className="mt-8 mb-4 text-4xl font-mono">backtalk.dev</h1>
            </div>
          </div>
        <hr className="mx-8"></hr>
        <div className="py-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row flex-wrap justify-center">
              <div className="basis-1/2 text-center">
                <label htmlFor="textField">Enter Text:</label>
                <input
                    type="text"
                    id="textInput"
                    name="textInput"
                    value={textInputValue}
                    onChange={handleInputChange}
                    required
                    className="rounded border border-stone-200"
                />
              </div>
              <div className="basis-1/2 text-center">
                <label htmlFor="textField">Output:</label>
                <input
                    type="text"
                    id="textOutput"
                    name="textOutput"
                    // value={textOutputValue}
                    // onChange={handleInputChange}
                    // required
                    className="rounded border border-stone-200"
                />
              </div>
            </div>
            <div className="flex flex-row flex-wrap justify-center">
              <button type="submit" className="basis-1/12 rounded border border-stone-200">
                Submit
              </button>
            </div>
          </form>
      </div>
      </div>
  );
};

export default App;
