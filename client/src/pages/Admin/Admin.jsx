import React from "react";
import AdminLeft from "@/components/AdminLeft/AdminLeft";
import AdminRight from "@/components/AdminRight.jsx/AdminRight";

export default function Admin ({ propertyData }) {
  return (
    <div className="w-full bg-white">
      <div className="W-full px-4 py-6 flex flex-col lg:flex-row gap-2">
        
        {/* Left Section */}
        <div className="w-full lg:basis-[40%]">
          <AdminLeft propertyData={propertyData} />
        </div>

        {/* Right Section (Sticky) */}
        <div className="w-full lg:basis-[60%]">
          {/* Sticky wrapper */}
            <AdminRight propertyData={propertyData} />
        </div>
      </div>
    </div>
  );
}