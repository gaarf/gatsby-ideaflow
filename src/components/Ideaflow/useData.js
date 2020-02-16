import { useStaticQuery, graphql } from "gatsby";
import { useMemo } from "react";

export default function useAutocompleteData() {
  const {
    allAutocompleteJson: { nodes },
  } = useStaticQuery(graphql`
    query MyQuery {
      allAutocompleteJson {
        nodes {
          key
          value
        }
      }
    }
  `);
  return useMemo(
    () =>
      nodes.reduce(
        (memo, { key, value }) => ({
          ...memo,
          [key]: value,
        }),
        {}
      ),
    [nodes]
  );
};
