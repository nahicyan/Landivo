// page.jsx
"use client";

import React, { useState } from "react";
import { PuffLoader } from "react-spinners";
import useProperties from "@/components/hooks/useProperties";
import { columns } from "../DataTable/Columns";
import { DataTable } from "../DataTable/DataTable";

export default function PropertiesPage() {
  const { data, isError, isLoading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">Error fetching data.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  // Filter properties using OR logic across multiple fields
  const filteredData = data.filter((property) => {
    const query = searchQuery.toLowerCase();
    return (
      property.title?.toLowerCase().includes(query) ||
      property.streetAddress?.toLowerCase().includes(query) ||
      property.state?.toLowerCase().includes(query) ||
      property.zip?.toLowerCase().includes(query) ||
      property.area?.toLowerCase().includes(query) ||
      property.apnOrPin?.toLowerCase().includes(query) ||
      property.ltag?.toLowerCase().includes(query) ||
      property.rtag?.toLowerCase().includes(query) ||
      property.city?.toLowerCase().includes(query) ||
      property.county?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-12 text-[#4b5b4d]">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, address, state, zip, area, APN, tags, city, or county"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
          />
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
