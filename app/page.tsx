'use client';

import React, { useState } from 'react';
import FixedTextArea from "@/components/FixedTextArea";

const apiURL: string = process.env.NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL || "http://localhost";
const submitTypeRaw = 'raw';
const submitTypeJSON = 'json';

const App: React.FC = () => {
  const [textInputValue, setTextInputValue] = useState('');
  const [textOutputValue, setTextOutputValue] = useState('');

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, submitType: string) => {
    e.preventDefault();

    try {
      let url = apiURL;
      if (submitType === submitTypeJSON) {
        url += '/json';
      }
      console.log(url);

      const responseData = await submitFormToApi({ textInputValue: textInputValue }, url);
      if (submitType === submitTypeJSON) {
        setTextOutputValue(JSON.stringify(responseData));
      } else {
        setTextOutputValue(responseData);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const submitFormToApi = async (requestData: { textInputValue: string; }, apiUrl: string): Promise<any> => {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData.textInputValue)
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
          <form onSubmit={(e) => handleSubmit(e, submitTypeRaw)}>
            <div className="flex flex-row flex-wrap justify-center">
              <div className="basis-1/2 text-center">
                <div className="lg:basis-1/2 basis-full">
                  <label htmlFor="textInput">Enter Text:</label>
                </div>
                <div className="lg:basis-1/2 basis-full">
                  <FixedTextArea
                      id="textInput"
                      rows={16}
                      cols={40}
                      value={textInputValue}
                      onChange={handleTextInputChange}
                  />
                </div>
              </div>
              <div className="basis-1/2 text-center">
                <div className="lg:basis-1/2 basis-full">
                  <label htmlFor="textOutput">Output:</label>
                </div>
                <div className="lg:basis-1/2 basis-full">
                  <FixedTextArea
                      id="textOutput"
                      rows={16}
                      cols={40}
                      value={textOutputValue}
                      onChange={null}
                      readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap justify-center my-8">
              <button type="submit" id="submitRaw" className="lg:basis-1/6 basis-1/2 rounded border border-stone-200">
                Submit Raw
              </button>
              <div className="lg:basis-1/12 basis-full my-2"></div>
            </div>
          </form>
          <form onSubmit={(e) => handleSubmit(e, submitTypeJSON)}>
            <div className="flex flex-row flex-wrap justify-center my-8">
              <button type="submit" id="submitJSON" className="lg:basis-1/6 basis-1/2 rounded border border-stone-200">
                Submit JSON
              </button>
              <div className="lg:basis-1/12 basis-full my-2"></div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default App;
