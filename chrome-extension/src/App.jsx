import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [response1, setResponse1] = useState(0) // Corrected 'resoponse' to 'response'

  async function extractSelectedText() {
      const selectedText = window.getSelection().toString();
      fetch('http://127.0.0.1:8000/analyze').then((res) => {
        console.log(res);
      })

      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ terms: selectedText })
      });

      const data = (await response.json()).message
      chrome.runtime.sendMessage({
        action: "getSource",
        data: data,
      });
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
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.action == "getSource") {
          setResponse1(request.data)
        }
      }.bind(this));

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: extractSelectedText
      });
    });
  }

  return (
    <>
      <h1>Terms & Conditions Manager</h1>
      <div className="card">
        <button onClick={openExtensionPopup}>Extract Text</button>
      </div>
      {response1 && <p className="read-the-docs">
        {response1}
      </p>}
      {!response1 && <p className='read-the-docs'>Drag text and extract!</p>}
    </>
  )
}

export default App
