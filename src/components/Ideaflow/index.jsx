import React, { useState, useRef, useEffect, useCallback } from "react";
import { Editor, EditorState, SelectionState } from "draft-js";
import "draft-js/dist/Draft.css";
import useDecorator from "./useDecorator";
import useKeys from "./useKeys";

// Thanks, I hate it

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export default function() {
  const editorRef = useRef(); // dom element
  const hackyRef = useRef({}); // hacky references

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSuggestion = useCallback(function(content, blockKey, entityKey) {
    content.getBlockForKey(blockKey).findEntityRanges(
      char => char.getEntity() === entityKey,
      (start, end) => {
        const newState = EditorState.forceSelection(
          EditorState.push(
            hackyRef.current.state,
            content,
            "spellcheck-change"
          ),
          SelectionState.createEmpty(blockKey).merge({
            anchorOffset: end,
            focusOffset: end
          })
        );
        console.log("onSuggestion", content.getPlainText());
        setTimeout(() => {
          hackyRef.current.setEditorState(newState);
        }, 1);
      }
    );
  }, []);

  const { decorator, updateEntities } = useDecorator(onSuggestion);

  const [state, setState] = useState(EditorState.createEmpty(decorator));

  const setEditorState = useCallback(
    s => setState(updateEntities(s)),
    [setState, updateEntities]
  );

  hackyRef.current = { state, setEditorState }; // sorry, not sorry

  const { keyBindingFn, handleKeyCommand } = useKeys(setEditorState);

  const focus = useCallback(() => editorRef.current.focus(), [editorRef]);
  useEffect(focus, []);

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
