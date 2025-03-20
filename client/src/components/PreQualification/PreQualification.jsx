"use client";

import React from "react";
import { Check } from "lucide-react"; // or your preferred check icon
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



export default function PreQualification() {
  const navigate = useNavigate();


  return (
    <div className="flex items-center justify-between bg-[#ccf5cc] p-4 rounded-lg">
      {/* Left Column: Bullet Points */}
      <div className="flex flex-col gap-2 text-sm text-[#01783e]">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Takes About 2 Minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Won’t affect your credit score</span>
        </div>
      </div>

      {/* Right Column: Button */}
      <Button
onClick={() => window.open("https://qualify.landersinvestment.com", "_blank")}
className="
    bg-[#324c48] 
    text-white 
    px-4 
    py-2 
    text-sm 
    font-semibold 
    rounded-md 
    hover:bg-[#3f4f24]
    transition-colors
  "
>
  Get Pre-Qualified
</Button>

    </div>
  );
}
