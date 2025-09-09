"use client";

import Layout from "./components/layout/Layout";
import BorrowerPipeline from "./components/pipeline/BorrowerPipeline";
import BorrowerDetail from "./components/details/BorrowerDetail";
import BrokerOverview from "./components/broker/BrokerOverview";

export default function Home() {
  return (
    <Layout>
      <BorrowerPipeline />
      <BorrowerDetail />
      <BrokerOverview />
    </Layout>
  );
}
