import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './css/NoteEditor.css'

function NoteEditor() {
  const noteId = "6917d095d3794db386c18f88"
  const [initialContent, setInitialContent] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent,
    contentType: 'markdown',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
    },
  })

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await axios.get(`/api/notes/${noteId}`)
        const content = res.data.content
        setInitialContent(content)
        if (editor) {
          editor.commands.setContent(content)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchNote()
  }, [noteId])

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML()
      setInitialContent(content)
      localStorage.setItem('savedText', content)
    }
  }

  return (
    <div className="custom-md-editor">
      {/* Toolbar matching your original styling */}
      <div className="w-md-editor-toolbar">
        <button className="save-button" onClick={handleSave}>
          Save Document
        </button>
        <p className="button-border"> | </p>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button onClick={() => editor?.chain().focus().toggleStrike().run()}>
          Strike
        </button>
        <button onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          HR
        </button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
        <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          Code
        </button>
        <p className="button-border"> | </p>
      </div>

      {/* Editor content with wrapper to match your sizing */}
      <div className="w-md-editor">
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </div>
  )
}

export default NoteEditor