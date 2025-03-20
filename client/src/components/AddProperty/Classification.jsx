"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Classification({ formData, handleChange }) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Property Classification & Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Type (Non-editable) */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Type</Label>
          <Input
            type="text"
            value="Land"
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        {/* Zoning */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Zoning</Label>
          <Select
            name="zoning"
            value={formData.zoning}
            onValueChange={(value) => handleChange({ target: { name: "zoning", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Zoning" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Residential",
                "Commercial",
                "Industrial",
                "Agricultural",
                "Mixed-Use",
                "Institutional",
                "Recreational",
                "Conservation",
                "Timberland",
                "Waterfront",
                "Vacant",
                "Undeveloped",
                "Specialty",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Restrictions */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Restrictions</Label>
          <Select
            name="restrictions"
            value={formData.restrictions}
            onValueChange={(value) => handleChange({ target: { name: "restrictions", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Restrictions" />
            </SelectTrigger>
            <SelectContent>
              {[
                "No Known Restriction(s)",
                "Zoning",
                "Deed",
                "Environmental",
                "Easement",
                "Setback",
                "Extraterritorial Jurisdiction",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Survey */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Survey</Label>
          <Select
            name="survey"
            value={formData.survey}
            onValueChange={(value) => handleChange({ target: { name: "survey", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select Survey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>



        {/* Legal Description */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Legal Description</Label>
          <Input
            type="text"
            name="legalDescription"
            value={formData.legalDescription}
            onChange={handleChange}
            placeholder="Enter Legal Description"
          />
        </div>

        {/* Mobile Home Friendly */}
        <div className="flex flex-col space-y-1 mb-4">
          <Label className="text-gray-700 font-semibold">Mobile Home Friendly</Label>
          <Select
            name="mobileHomeFriendly"
            value={formData.mobileHomeFriendly}
            onValueChange={(value) => handleChange({ target: { name: "mobileHomeFriendly", value } })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-[#324c48] focus:ring-1 focus:ring-[#324c48]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Verify">Verify</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
