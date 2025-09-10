"use client";

import Layout from "./components/layout/Layout";
import BorrowerPipeline from "./components/BorrowerPipeline";
import BorrowerDetail from "./components/BorrowerDetail";
import BrokerOverview from "./components/BrokerOverview";

export default function Home() {
  return (
    <Layout>
      <BorrowerPipeline />
      <BorrowerDetail />
      <BrokerOverview />
    </Layout>
  );
}
