"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSignIcon } from "lucide-react";

export default function TotalMonthlyPayments({ surveyData, updateSurveyData, onNext, onBack }) {
  const [totalPayments, setTotalPayments] = useState(surveyData.total_monthly_payments || "");

  // Format currency as user types
  const formatCurrency = (value) => {
    if (!value) return "";
    
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    
    // Format with $ and commas
    return numericValue ? `$${parseInt(numericValue, 10).toLocaleString()}` : "";
  };

  // Handle input change
  const handleInputChange = (e) => {
    const formattedValue = formatCurrency(e.target.value);
    setTotalPayments(formattedValue);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store raw numeric value
    const rawValue = totalPayments.replace(/[^0-9]/g, "");
    updateSurveyData("total_monthly_payments", rawValue);
    
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What are the total monthly payments?",
      next: "Next",
      back: "Back"
    },
    es: {
      title: "¿Cuáles son los pagos mensuales totales?",
      next: "Siguiente",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative mt-8">
              <Label htmlFor="monthly-payments" className="sr-only">Monthly Payments</Label>
              <div className="relative">
                <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  id="monthly-payments"
                  type="text"
                  value={totalPayments}
                  onChange={handleInputChange}
                  className="pl-10 py-6 text-xl border-[#3f4f24] focus:border-[#D4A017] focus:ring-[#D4A017]"
                  placeholder="Enter total monthly payments"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
                onClick={onBack}
              >
                {t.back}
              </Button>
              
              <Button
                type="submit"
                className="bg-[#3f4f24] hover:bg-[#546930] text-white"
                disabled={!totalPayments}
              >
                {t.next}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}