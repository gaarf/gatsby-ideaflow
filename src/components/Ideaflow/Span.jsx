import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Modifier, SelectionState } from "draft-js";

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

function Span({
  autocomplete,
  prefix,
  decoratedText,
  onSuggestion,
  contentState,
  blockKey,
  offsetKey,
  entityKey,
  children,
}) {
  const [suggVisible, setSuggVisible] = useState(
    !contentState.getEntity(entityKey).data.suggHidden
  );
  const textRx = useMemo(
    () => new RegExp(decoratedText.substring(prefix.length), "i"),
    [decoratedText, prefix]
  );
  const suggestions =
    suggVisible && decoratedText.length > prefix.length
      ? autocomplete.filter(
          one => decoratedText !== `${prefix}${one}` && one.match(textRx)
        )
      : [];

  const hideSuggestions = useCallback(() => {
    contentState.mergeEntityData(entityKey, {
      suggHidden: true,
    });
    setSuggVisible(false);
  }, [setSuggVisible, entityKey, contentState]);

  const timeoutRef = useRef(null);

  const cancelLater = useCallback(() => {
    const { current } = timeoutRef;
    clearTimeout(current);
  }, [timeoutRef]);

  const hideSuggestionsLater = useCallback(() => {
    cancelLater();
    timeoutRef.current = setTimeout(() => hideSuggestions(), 4000);
  }, [cancelLater, timeoutRef, hideSuggestions]);

  const showSuggestions = useCallback(() => {
    setSuggVisible(true);
    hideSuggestionsLater();
  }, [setSuggVisible, hideSuggestionsLater]);

  useEffect(() => {
    hideSuggestionsLater();
    return cancelLater;
  }, [hideSuggestionsLater, cancelLater]);

  const handleSuggestionClick = useCallback(
    (event, suggestion) => {
      hideSuggestions();
      const block = contentState.getBlockForKey(blockKey);

      block.findEntityRanges(
        char => char.getEntity() === entityKey,
        (start, end) => {
          onSuggestion(
            Modifier.replaceText(
              contentState,
              SelectionState.createEmpty(blockKey).merge({
                anchorOffset: start,
                focusKey: blockKey,
                focusOffset: end,
              }),
              `${prefix}${suggestion} `,
              undefined,
              entityKey
            ),
            blockKey,
            entityKey
          );
        }
      );
    },
    [hideSuggestions, contentState, prefix, onSuggestion, blockKey, entityKey]
  );

  const backgroundColor = {
    "#": "yellow",
    "@": "lightgreen",
    "<>": "lightblue",
  }[prefix];

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        backgroundColor,
      }}
      data-offset-key={offsetKey}
    >
      <div
        onMouseDown={() =>
          suggVisible ? hideSuggestions() : showSuggestions()
        }
        role="button"
        tabIndex={-1}
      >
        {children}
      </div>
      {suggestions.length > 0 && (
        <ul
          suppressContentEditableWarning
          contentEditable="false"
          style={{
            cursor: "default",
            userSelect: "none",
            position: "absolute",
            whiteSpace: "nowrap",
            border: "1px outset #CCC",
            backgroundColor,
            listStyleType: "none",
            borderRadius: 5,
            margin: "2px 0 0 0",
            padding: "1px 2px",
          }}
          onMouseEnter={cancelLater}
          onMouseLeave={hideSuggestionsLater}
        >
          {suggestions.map(one => (
            <li
              key={one}
              style={{
                margin: "1px 0",
              }}
            >
              <button
                style={{
                  margin: 0,
                  display: "block",
                  lineHeight: 1.1,
                  fontSize: "77%",
                }}
                onClick={e => handleSuggestionClick(e, one)}
              >
                {one}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

export const mkSpan = prefix => ({ entityKey, ...props }) => (
  <Span key={entityKey} prefix={prefix} entityKey={entityKey} {...props} />
);

export default Span;
