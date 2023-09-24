import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  function sendTextToServer(text) {
    fetch('http://127.0.0.1:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }

  function extractSelectedText() {
    const selectedText = window.getSelection().toString();
    alert(selectedText)
    sendTextToServer(selectedText);
  }

  const openExtensionPopup = () =>{
    // chrome.scripting.executeScript({
    //   target: {tabId: chrome.tabs.getCurrent().id},
    //   func: extractSelectedText
    // });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: extractSelectedText
      });
    });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AI Legal Assistant</h1>
      <div className="card">
        <button onClick={openExtensionPopup}>Extract Text</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
