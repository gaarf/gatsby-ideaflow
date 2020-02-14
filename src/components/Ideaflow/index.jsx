import React, { useState, useRef } from "react"
import { Editor, EditorState } from "draft-js"

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */

export default function() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const editorRef = useRef()

  const onChange = s => {
    console.log(editorRef.current, s)
    setEditorState(s)
  }

  return (
    <div
      role="textbox"
      onClick={() => editorRef.current.focus()}
      style={{
        border: "1px inset #CCC",
        padding: "3px",
        borderRadius: "3px",
        marginBottom: "1em",
        minHeight: "10em",
        cursor: "text",
      }}
    >
      <Editor editorState={editorState} onChange={onChange} ref={editorRef} />
    </div>
  )
}
