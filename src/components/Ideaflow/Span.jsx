import React, { useState } from "react";

export default function Span({
  autocomplete,
  prefix,
  decoratedText,
  offsetKey,
  children,
}) {
  const handleClick = suggestion => {
    console.log(`${prefix}${suggestion}`);
  };

  const [suggVisible] = useState(true);
  const textRx = new RegExp(decoratedText.substring(prefix.length), 'i');
  const suggestions = suggVisible ? autocomplete.filter(one => one.match(textRx)) : [];

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        backgroundColor: "yellow",
      }}
      data-offset-key={offsetKey}
    >
      {children}
      {suggestions.length > 0 && (
        <ul
          style={{
            cursor: "default",
            userSelect: "none",
            position: "absolute",
            whiteSpace: "nowrap",
            border: "1px outset #CCC",
            backgroundColor: "#EEE",
            listStyleType: "none",
            borderRadius: 5,
            margin: "2px 0 0 0",
            padding: 5,
          }}
        >
          {suggestions.map(one => (
            <li
              key={one}
              style={{
                margin: 0,
              }}
            >
              <a
                style={{
                  cursor: "pointer",
                }}
                href={one}
                onClick={() => handleClick(one)}
              >
                {one}
              </a>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
