import { useMemo } from "react";
import { getDefaultKeyBinding } from "draft-js";

export default function useKeys(setEditorState) {
  return useMemo(
    () => ({
      keyBindingFn: getDefaultKeyBinding,

      handleKeyCommand: (command, editorState) => {
        // const handle = s => {
        //   if (s) {
        //     setEditorState(s);
        //   }
        //   return "handled";
        // }
        // if (command === "backspace") {
        //   const selection = editorState.getSelection();
        //   const start = selection.getStartOffset();
        //   const end = selection.getEndOffset();
        //   if(start === end) {
        //     const anchorKey = selection.getAnchorKey();
        //     const currentContentBlock = editorState
        //       .getCurrentContent()
        //       .getBlockForKey(anchorKey);
        //     console.log(start, currentContentBlock.getEntityAt(start));
        //     return handle();
        //   }
        // }
        return "not-handled";
      },
    }),
    [setEditorState]
  );
}
