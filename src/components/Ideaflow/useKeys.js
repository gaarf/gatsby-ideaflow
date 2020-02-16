import { useMemo } from "react";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";
const { hasCommandModifier } = KeyBindingUtil;

export default function useKeys(setEditorState) {
  return useMemo(
    () => ({
      keyBindingFn(e) {
        console.log(e);
        if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
          return "myeditor-save";
        }
        return getDefaultKeyBinding(e);
      },

      handleKeyCommand(command, editorState) {
        if (command === "myeditor-save") {
          // Perform a request to save your contents, set
          // a new `editorState`, etc.
          setEditorState(editorState);
          return "handled";
        }
        return "not-handled";
      },
    }),
    [setEditorState]
  );
}
