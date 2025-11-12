import React, { useState, useRef, useEffect } from 'react'
import MDEditor, { commands, heading1, heading2, heading3, heading4, heading5, heading6 } from '@uiw/react-md-editor';
import './App.css'
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';


function App() {
  const [value, setValue] = useState(() => localStorage.getItem('savedText') || '');

  const handleSave = () => {
    localStorage.setItem('savedText', value);
  };

  /* This is to put the save button in the toolbar */
  const saveCommand = {
    name:"save",
    keyCommand:"save",
    icon: <button className="save-button" onClick={handleSave}> Save Document </button>,
    execute: (state, api) => {
      localStorage.setItem('savedText', state.text);
    }
    
  
  }
  
  

  return (
    <>
    
      <div className="custom-md-editor">
        
        <MDEditor
          value={value}
          onChange={setValue}
          visibleDragbar = {false}
          
          commands = {[
            saveCommand,
            commands.group([
              commands.title1,
              commands.title2,
              commands.title3,
              commands.title4,
              commands.title5,
              commands.title6
            ], {
              name: 'title',
              groupName: 'title',
              buttonProps: { 'aria-label': 'Insert title' },
              className:"title-button",
            }),       // All heading levels grouped
            commands.bold,         // Bold **
            commands.italic,       // Italics
            commands.strikethrough,
            commands.hr,           // Horizontal Rule ---
            commands.link,         // Insert link
            commands.image,       // Insert image
            commands.unorderedListCommand, // Bullet list
            commands.orderedListCommand,   // Numbered list
            commands.code,         // Inline code
            commands.table,
            commands.divider,      // Toolbar divider line
            
          ]}
        />
        
      </div>


    </>
  );
}

export default App;