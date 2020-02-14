import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Ideaflow from "../components/Ideaflow"
// import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    {/* <SEO title="Home" /> */}
    <Ideaflow />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
