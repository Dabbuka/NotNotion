import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import './css/NoteEditor.css'

const SAVE_MODE = 'local'

function NoteEditor() {
  const noteId = "6917d095d3794db386c18f88"
  const [initialContent, setInitialContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'custom-link',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true, // Allow base64 images for paste
        HTMLAttributes: {
          class: 'custom-image',
        },
      }),
      Dropcursor.configure({
        color: '#1a73e8',
        width: 2,
      }),
    ],
    content: initialContent,
    editorProps: {
      handlePaste: (event) => {
        const items = Array.from(event.clipboardData?.items || [])

        // Check if there are any image items in the clipboard
        const imageItems = items.filter(item => item.type.indexOf('image') !== -1)

        if (imageItems.length > 0) {
          event.preventDefault()

          imageItems.forEach(item => {
            const file = item.getAsFile()
            if (file) {
              const reader = new FileReader()

              reader.onload = (e) => {
                const base64Image = e.target?.result
                if (base64Image && editor) {
                  // Insert the image at the current cursor position
                  editor.chain().focus().setImage({ src: base64Image }).run()
                }
              }

              reader.readAsDataURL(file)
            }
          })

          return true // Prevent default paste behavior
        }

        return false // Allow default paste for non-image content
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = Array.from(event.dataTransfer.files)
          const imageFiles = files.filter(file => file.type.indexOf('image') !== -1)

          if (imageFiles.length > 0) {
            event.preventDefault()
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

            imageFiles.forEach(file => {
              const reader = new FileReader()

              reader.onload = (e) => {
                const base64Image = e.target?.result
                if (base64Image && editor && coordinates) {
                  editor.chain().focus().insertContentAt(coordinates.pos, {
                    type: 'image',
                    attrs: { src: base64Image }
                  }).run()
                }
              }

              reader.readAsDataURL(file)
            })

            return true
          }
        }

        return false
      }
    },
  })

  useEffect(() => {
    async function loadNote() {
      try {
        let content = ''
        let title = ''
        const contentKey = `note-${noteId}`
        const titleKey = `note-title-${noteId}`

        if (SAVE_MODE === 'backend') {
          const res = await axios.get(`/api/notes/${noteId}`)
          content = res.data.content || ''
          title = res.data.title || ''
        } else {
          // Load from localStorage instead
          const savedContent = localStorage.getItem(contentKey)
          const savedTitle = localStorage.getItem(titleKey)
          content = savedContent || ''
          title = savedTitle || ''
        }

        setInitialContent(content)
        setNoteTitle(title)
        if (editor) {
          editor.commands.setContent(content)
        }
      } catch (err) {
        console.error('Error loading note:', err)
        const contentKey = `note-${noteId}`
        const titleKey = `note-title-${noteId}`
        const savedContent = localStorage.getItem(contentKey) || ''
        const savedTitle = localStorage.getItem(titleKey) || ''
        setInitialContent(savedContent)
        setNoteTitle(savedTitle)
        if (editor) {
          editor.commands.setContent(savedContent)
        }
      }
    }

    loadNote()
  }, [noteId, editor])

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML()
      const contentKey = `note-${noteId}`
      const titleKey = `note-title-${noteId}`

      // Save content and title the same way
      localStorage.setItem(contentKey, content)
      localStorage.setItem(titleKey, noteTitle)
      setInitialContent(content)
    }
  }

  return (
    <div className="custom-md-editor">
      <div className="w-md-editor-toolbar">
        
        <button className="save-button" onClick={handleSave}>
          Save Document
        </button>
        <input
          type="text"
          className="note-title-input"
          placeholder="Untitled document"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
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
      <div className="w-md-editor">
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </div>
  )
}

export default NoteEditor