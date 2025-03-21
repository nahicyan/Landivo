"use client";

import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSignIcon } from "lucide-react";

export default function GrossAnnualIncome({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection
  const handleSelection = (income) => {
    updateSurveyData("gross_annual_income", income);
    
    // Set disqualification flag for lower income tiers
    if (["Less than $30,000", "$30,000 - $50,000", "$50,000 - $75,000"].includes(income)) {
      updateSurveyData("disqualificationFlag", true);
    }
    
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What is your household gross (before taxes) annual income?",
      lessThan30k: "Less than $30,000",
      between30kAnd50k: "$30,000 - $50,000",
      between50kAnd75k: "$50,000 - $75,000",
      between75kAnd100k: "$75,000 - $100,000",
      between100kAnd150k: "$100,000 - $150,000",
      between150kAnd200k: "$150,000 - $200,000",
      moreThan200k: "Over $200,000",
      back: "Back"
    },
    es: {
      title: "¿Cuál es el ingreso bruto anual de su hogar (antes de impuestos)?",
      lessThan30k: "Menos de $30,000",
      between30kAnd50k: "$30,000 - $50,000",
      between50kAnd75k: "$50,000 - $75,000",
      between75kAnd100k: "$75,000 - $100,000",
      between100kAnd150k: "$100,000 - $150,000",
      between150kAnd200k: "$150,000 - $200,000",
      moreThan200k: "Más de $200,000",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  // Define income ranges with their corresponding translations and UI classes
  const incomeRanges = [
    { 
      value: "Less than $30,000", 
      label: t.lessThan30k,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]" 
    },
    { 
      value: "$30,000 - $50,000", 
      label: t.between30kAnd50k,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]"
    },
    { 
      value: "$50,000 - $75,000", 
      label: t.between50kAnd75k,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]"
    },
    { 
      value: "$75,000 - $100,000", 
      label: t.between75kAnd100k,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]"
    },
    { 
      value: "$100,000 - $150,000", 
      label: t.between100kAnd150k,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]"
    },
    { 
      value: "$150,000 - $200,000", 
      label: t.between150kAnd200k,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]"
    },
    { 
      value: "Over $200,000", 
      label: t.moreThan200k,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]"
    }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <div className="grid grid-cols-1 gap-3 mt-8">
            {incomeRanges.map((income) => (
              <Button
                key={income.value}
                className={`py-4 px-4 text-base rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-start ${income.classes}`}
                onClick={() => handleSelection(income.value)}
              >
                <DollarSignIcon className="w-5 h-5 mr-2" />
                {income.label}
              </Button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
              onClick={onBack}
            >
              {t.back}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}