import { useStaticQuery, graphql } from "gatsby";

export default () => {
  const { allAutocompleteJson: { nodes } } = useStaticQuery(graphql`
    query MyQuery {
      allAutocompleteJson {
        nodes {
          key
          value
        }
      }
    }
  `);
  return nodes.reduce((memo, { key, value }) => ({
    ...memo,
    [key]: value,
  }), {});
}