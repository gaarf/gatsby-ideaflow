import React, { useState, useRef, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import useData from "./useData";

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export default function() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef();

  const handleChange = s => setEditorState(s);
  const focus = () => editorRef.current.focus();

  useEffect(focus, []);

  const data = useData();
  console.log(data);

  return (
    <div
      onClick={focus}
      style={{
        border: "1px inset #CCC",
        padding: "3px",
        borderRadius: "3px",
        marginBottom: "1em",
        minHeight: "10em",
        cursor: "text",
      }}
    >
      <Editor
        editorState={editorState}
        onChange={handleChange}
        ref={editorRef}
      />
    </div>
  );
}
