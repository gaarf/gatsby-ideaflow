import { useMemo } from "react";
import { getDefaultKeyBinding } from "draft-js";

export default function useKeys(setEditorState) {
  return useMemo(
    () => ({
      keyBindingFn: getDefaultKeyBinding,

      handleKeyCommand: (command, editorState) => {
        const handle = s => {
          if (s) {
            setEditorState(s);
          }
          return "handled";
        }
        if (command === "whatever") {
          return handle();
        }
        return "not-handled";
      },
    }),
    [setEditorState]
  );
}
