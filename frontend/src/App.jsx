import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [text, setText] = useState(localStorage.getItem('savedText') || '');

  const handleSave = () => {
    localStorage.setItem('savedText', text);
  };
  
  return (
    <>
    <button className="saveButton" onClick={handleSave}>Save</button>
  <div>
    <textarea className="textBox" id="body" placeholder="Write here.."
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
        <br />
  </div>
    
    
    </>
      
  )
}

export default App
