import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [result, setResult] = useState(null) // Corrected 'resoponse' to 'response'
  const pRef = useRef('Please extract text.')
  

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
      pRef.current.textContent = data;
      setResult(data)
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
      <p ref={pRef} className="read-the-docs">
        {result}
      </p>
    </>
  )
}

export default App
