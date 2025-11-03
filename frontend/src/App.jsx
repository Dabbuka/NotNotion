import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from 'remark-breaks'
import './App.css'

function App() {
  const [text, setText] = useState(localStorage.getItem('savedText') || '');
  const editorRef = useRef(null)
  const handleSave = () => {
    localStorage.setItem('savedText', text);
  };
  const handleInput = (e) => {
    setText(e.currentTarget.innerText)
  }
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text
    }
  }, [text])
  return (
    <>
      <button className="saveButton" onClick={handleSave}>Save</button>
      <div className="editor-container">
        <div
          ref={editorRef}
          className="markdown-input"
          contentEditable
          onInput={handleInput}
          placeholder="Write here.."
        />
        <div className="markdown-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {text}
          </ReactMarkdown>
        </div>
      </div >

    </>

  )
}

export default App
