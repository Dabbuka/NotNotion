import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import { authService, noteService, folderService } from '../services'
import FolderTree from './FolderTree'
import './css/NoteEditor.css'

const SAVE_MODE = 'backend'

function NoteEditor() {
  const [searchParams] = useSearchParams()
  const urlNoteId = searchParams.get('noteId')
  
  const userId = authService.getCurrentUserId()

  const [noteId, setNoteId] = useState(urlNoteId || null)
  const [initialContent, setInitialContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [folders, setFolders] = useState([])
  const [notes, setNotes] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

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
    // Update noteId when URL parameter changes
    const urlNoteId = searchParams.get('noteId')
    setNoteId(urlNoteId || null)
  }, [searchParams])

  // Fetch folders and notes for sidebar
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        const [foldersData, notesData] = await Promise.all([
          folderService.getAllFolders(userId),
          noteService.getAllNotes(userId)
        ]);
        setFolders(foldersData);
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleFolderClick = (folderId) => {
    // Navigate to home page with folder context
    navigate(`/home?folder=${folderId}`);
  };

  const handleNoteClick = (clickedNoteId) => {
    // Navigate to the clicked note
    navigate(`/app?noteId=${clickedNoteId}`);
  };

  useEffect(() => {
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    if (!editor) {
      return;
    }
    async function loadNote() {
      try {
        let content = ''
        let title = ''
        let loadedNoteId = null

        if (SAVE_MODE === 'backend') {
          // If a specific noteId is provided (from URL or state), load that note
          // Otherwise, load the most recent note
          if (noteId) {
            const noteData = await noteService.getNoteById(noteId)
            content = noteData.content || ''
            title = noteData.title || ''
            loadedNoteId = noteData._id || null
          } else {
            // No specific note requested, load the most recent note
            const noteData = await noteService.getMostRecentNote(userId)
            content = noteData.content || ''
            title = noteData.title || ''
            loadedNoteId = noteData._id || null
          }
          setNoteId(loadedNoteId)
        } else {
          // Load from localStorage instead
          // For localStorage mode, we'd need a different approach to get the most recent note
          // For now, fallback to empty if no noteId is available
          if (noteId) {
            const contentKey = `note-${noteId}`
            const titleKey = `note-title-${noteId}`
            const savedContent = localStorage.getItem(contentKey)
            const savedTitle = localStorage.getItem(titleKey)
            content = savedContent || ''
            title = savedTitle || ''
          }
        }

        setInitialContent(content)
        setNoteTitle(title)
        if (editor) {
          editor.commands.setContent(content)
        }
      } catch (err) {
        console.error('Error loading note:', err)
        // If no notes exist for the user, start with empty note
        if (err.response?.status === 404) {
          setInitialContent('')
          setNoteTitle('')
          if (editor) {
            editor.commands.setContent('')
          }
        } else {
          // Fallback to localStorage if backend fails
          if (noteId) {
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
      }
    }

    loadNote()
  }, [userId, editor, noteId])

  const handleSave = async () => {
    if (!editor) {
      return;
    }
    
    const content = editor.getHTML()

    if (SAVE_MODE === 'backend') {
      try {
        if (noteId) {
          // Update existing note
          await noteService.updateNote(noteId, {
            title: noteTitle,
            content: content
          })
        } else {
          // Create new note if no noteId exists
          if (!userId) {
            console.error('User not logged in');
            return;
          }
          const newNote = await noteService.createNote({
            title: noteTitle || 'Untitled',
            content: content,
            userID: userId
          })
          setNoteId(newNote._id)
        }
        setInitialContent(content)
      } catch (err) {
        console.error('Error saving note:', err)
        // Fallback to localStorage on error
        if (noteId) {
          const contentKey = `note-${noteId}`
          const titleKey = `note-title-${noteId}`
          localStorage.setItem(contentKey, content)
          localStorage.setItem(titleKey, noteTitle)
        }
      }
    } else {
      // Save to localStorage
      if (noteId) {
        const contentKey = `note-${noteId}`
        const titleKey = `note-title-${noteId}`
        localStorage.setItem(contentKey, content)
        localStorage.setItem(titleKey, noteTitle)
      }
      setInitialContent(content)
    }
  }

  return (
    <div className="custom-md-editor">
      <div className="w-md-editor-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            className="note-title-input"
            placeholder="Untitled document"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="toolbar-center">
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
        </div>
      <div className={`editor-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Sidebar Toggle Button */}
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        {/* Sidebar - Similar to Notion */}
        <div className="sidebar">
          <div className="sidebar-content">
            <FolderTree
              folders={folders}
              notes={notes}
              currentFolderId={null}
              currentNoteId={noteId}
              onFolderClick={handleFolderClick}
              onNoteClick={handleNoteClick}
            />
          </div>
        </div>
        <div className="editor-wrapper">
          <div className="w-md-editor">
            <EditorContent editor={editor} className="editor-content" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteEditor
