import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [response, setResponse] = useState(null) // Corrected 'resoponse' to 'response'

  

  async function extractSelectedText() {
      const selectedText = window.getSelection().toString();
      // console.log(selectedText);
      // fetch('http://127.0.0.1:8000/analyze').then((res) => {
      //   console.log(res);
      // })

      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ terms: selectedText })
      });
      console.log('started');
      const data = (await response.json()).message
      console.log(data);
      setResponse(data)
  }

  async function sendTextToServer(selectedText) {
    try {
      console.log('Sending request to server...'); 
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ text: selectedText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Received response from server:', data);
      await setResponse(data);

    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  }

  const openExtensionPopup = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: extractSelectedText
      });
    });
  }

  return (
    <>
      <h1>AI Legal Assistant</h1>
      <div className="card">
        <button onClick={openExtensionPopup}>Extract Text</button>
      </div>
      {response && <p className="read-the-docs">
        {response}
      </p>}
      {!response && <p className='read-the-docs'>please drag text and extract!</p>}
    </>
  )
}

export default App
