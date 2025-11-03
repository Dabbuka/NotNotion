import { useState } from 'react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import './App.css'

function App() {
  const [text, setText] = useState("");
  return (
    <>
      <div className="text-wrapper">
        <div className="textBox">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
        <textarea className="textBox" value={text} onChange={(e) => setText(e.target.value)} id="body" placeholder="Writes notes here"></textarea>
      </div>
    </>
  )
}

export default App
