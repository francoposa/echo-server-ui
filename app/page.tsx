'use client';

import React, {useState} from 'react';
import FixedTextArea from "@/components/FixedTextArea";

const apiURL: string = process.env.NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL || "http://localhost:8080/api/v0";
let apiURLEchoRawRoute = apiURL + "/echo";
let apiURLEchoJSONRoute = apiURL + "/echo/json";
const submitTypeRaw = 'raw';
const submitTypeJSON = 'json';

const messagePrefixSuccess = 'Success!';
const messagePrefixError = 'Error from server:';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const dismissMessage = () => {
    setMessage('');
  };

  const [textInputValue, setTextInputValue] = useState('');
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value);
  };

  const [textOutputValue, setTextOutputValue] = useState('');

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>, submitType: string) => {
    e.preventDefault();

    try {
      let url: string =  submitType === submitTypeJSON ? apiURLEchoJSONRoute: apiURLEchoRawRoute;

      const resp: Response = await submitFormToApi({ textInputValue: textInputValue }, url);
      const respBody = await extractResponseBody(resp, submitType);
      const respMessage = makeMessage(resp);

      setMessage(respMessage);
      setTextOutputValue(respBody);

    } catch (err) {
      setMessage(`Error submitting form: ${err}`);
    }
  };

  const submitFormToApi = async (requestData: { textInputValue: string; }, apiUrl: string): Promise<Response> => {
    return await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData.textInputValue)
    });
  };

  async function extractResponseBody(resp: Response, submitType: string) {
    let respBody = '';

    if (resp.status < 400) {
      respBody = await resp.json();
      if (submitType === submitTypeJSON) {
        respBody = JSON.stringify(respBody);
      }
    }

    return respBody;
  }

  const makeMessage = (resp: Response): string => {
    let messagePrefix = (resp.status < 400) ?  messagePrefixSuccess : messagePrefixError;
    return `${messagePrefix} ${resp.status} ${resp.statusText}`
  }

  return (
      <div className="container max-w-6xl border border-stone-200 bg-white font-mono">
        <div className="flex flex-row flex-wrap">
          <div className="basis-full text-center">
            <h1 className="mt-8 mb-4 text-4xl font-mono">backtalk.dev</h1>
          </div>
        </div>
        <hr className="mx-8"></hr>

        <div className="py-8">
          <div className="flex flex-row flex-wrap justify-center text-center">

            <div className="lg:basis-1/2 basis-full">
              <div className="lg:basis-1/2 basis-full lg:mb-2">
                <label htmlFor="textInput">Enter Text:</label>
              </div>
              <div className="lg:basis-1/2 basis-full lg:ml-4">
                <FixedTextArea
                    id="textInput"
                    rows={16}
                    cols={40}
                    value={textInputValue}
                    onChange={handleTextInputChange}
                />
              </div>
            </div>

            <div className="lg:basis-1/2 basis-full">
              <div className="lg:basis-1/2 basis-full lg:mb-2">
                <label htmlFor="textOutput">Output:</label>
              </div>
              <div className="lg:basis-1/2 basis-full lg:mr-4">
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

          {message && (
              <div className="flex flex-row flex-wrap my-4 items-center justify-center text-center">
                <div id="message" className="lg:basis-1/2 basis-5/6 rounded bg-stone-100">
                  <div className="flex flex-row flex-wrap items-center justify-center text-center my-2">
                    <div id="message" className="lg:basis-5/6 basis-5/6 py-1">
                      {message}
                    </div>
                    <div className="lg:basis-1/12 basis-full text-xl">
                      <button  onClick={dismissMessage} >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          )}

        <form onSubmit={(e) => handleSubmitForm(e, submitTypeRaw)}>
            <div className="flex flex-row flex-wrap justify-center my-8">
              <button type="submit" id="submitRaw" className="lg:basis-1/6 basis-1/2 rounded border border-stone-200">
                Submit Raw
              </button>
            </div>
          </form>
          <form onSubmit={(e) => handleSubmitForm(e, submitTypeJSON)}>
            <div className="flex flex-row flex-wrap justify-center my-8">
              <button type="submit" id="submitJSON" className="lg:basis-1/6 basis-1/2 rounded border border-stone-200">
                Submit JSON
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default App;
