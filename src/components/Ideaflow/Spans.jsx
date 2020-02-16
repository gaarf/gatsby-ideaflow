import React from "react";

export const hashtagSpan = (hashtags) => {
  return function Span({decoratedText, offsetKey, children}) {
    console.log(decoratedText);

    return (
      <span style={{
        backgroundColor: 'yellow'
      }} data-offset-key={offsetKey}>
        {children}
      </span>
    );
  };  
}