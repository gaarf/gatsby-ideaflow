import { useMemo } from "react";
import {
  CompositeDecorator,
  EditorState,
  SelectionState,
  Modifier,
} from "draft-js";
import { mkSpan } from "./Span";
import useData from "./useData";

function hashtagStrategy(contentBlock, callback) {
  findWithRegex(/#[\w]+/g, contentBlock, callback);
}

function peopleStrategy(contentBlock, callback) {
  findWithRegex(/@[\w-]+/g, contentBlock, callback);
}

function relationStrategy(contentBlock, callback) {
  findWithRegex(/<>[A-Z][\w-]*(\s[A-Z][\w-]*)*/g, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

// function entityStrategy(contentBlock, callback) {
//   contentBlock.findEntityRanges(character => {
//     return character.getEntity() !== null;
//   }, callback);
// }

export default function useDecorator(onSuggestion) {
  const data = useData();

  return useMemo(() => {
    const { hashtags, people, relations } = data;

    return {
      decorator: new CompositeDecorator([
        {
          strategy: hashtagStrategy,
          component: mkSpan("#"),
          props: { autocomplete: hashtags, onSuggestion },
        },
        {
          strategy: peopleStrategy,
          component: mkSpan("@"),
          props: { autocomplete: people, onSuggestion },
        },
        {
          strategy: relationStrategy,
          component: mkSpan("<>"),
          props: { autocomplete: relations, onSuggestion },
        },
      ]),

      updateEntities(editorState) {
        let content = editorState.getCurrentContent();
        const blocks = content.getBlockMap();
        const selection = editorState.getSelection();

        blocks.forEach((block, blockKey) => {
          const update = (start, end) => {
            let entityKey = block.getEntityAt(start);
            if (!entityKey) {
              content = content.createEntity("ENTITY", "IMMUTABLE");
              entityKey = content.getLastCreatedEntityKey();
              console.log("new entity!", entityKey);
            }
            content = Modifier.applyEntity(
              content,
              SelectionState.createEmpty(blockKey).merge({
                anchorOffset: start,
                focusKey: blockKey,
                focusOffset: end,
              }),
              entityKey
            );
          };
          hashtagStrategy(block, update);
          peopleStrategy(block, update);
          relationStrategy(block, update);
        });

        return EditorState.acceptSelection(
          EditorState.push(editorState, content, "apply-entity"),
          selection
        );
      },
    };
  }, [data, onSuggestion]);
}
