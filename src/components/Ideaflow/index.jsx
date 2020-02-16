import React, { useState, useRef, useEffect, useCallback } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import useDecorator from "./useDecorator";
import useKeys from "./useKeys";

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export default function() {
  const editorRef = useRef();
  const [decorator, updateEntities] = useDecorator();
  const [state, setState] = useState(EditorState.createEmpty(decorator));
  const setEditorState = useCallback(
    s => {
      setState(updateEntities(s));
    },
    [setState, updateEntities]
  );
  const focus = useCallback(() => editorRef.current.focus(), [editorRef]);

  // focus the editor when the component mounts
  useEffect(focus, []);

  // keyboard functions
  const { keyBindingFn, handleKeyCommand } = useKeys(setEditorState);

  return (
    <div
      style={{
        // mimic a textarea
        border: "1px inset #CCC",
        padding: "3px",
        borderRadius: "3px",
        marginBottom: "1em",
        minHeight: "10em",
        cursor: "text",
      }}
      onClick={focus} // clicking the container focuses the editor
    >
      <Editor
        ref={editorRef}
        editorState={state}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
      />
    </div>
  );
}
