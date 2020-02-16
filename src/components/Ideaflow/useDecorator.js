import { useMemo } from "react";
import { CompositeDecorator } from "draft-js";
import { hashtagSpan } from "./Spans";
import useData from "./useData";

const HASHTAG_REGEX = /#[\w]+/g;

function hashtagStrategy(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}


export default function useDecorator() {
  const data = useData();

  return useMemo(() => {
    const { hashtags } = data;

    const decorator = new CompositeDecorator([
      {
        strategy: hashtagStrategy,
        component: hashtagSpan(hashtags),
      },
    ]);

    console.log(decorator);

    return decorator;
  }, [data]);
}