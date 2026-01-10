"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";
import { DocumentsTable } from "./documents-table";

const Home = () => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.documents.get,
    [],
    {
      initialNumItems: 10,
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        <DocumentsTable documents={results} loadMore={loadMore} status={status} />
      </div>
    </div>
  );
};

export default Home;
