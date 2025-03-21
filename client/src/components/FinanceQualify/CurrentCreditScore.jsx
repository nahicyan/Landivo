"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheckIcon } from "lucide-react";

export default function CurrentCreditScore({ surveyData, updateSurveyData, onNext, onBack }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  
  // Handle selection
  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    updateSurveyData("current_credit_score", choice);
    
    // Check if credit score leads to disqualification
    const disqualifyingScores = [
      "Below average (620-659)",
      "Poor (580-619)",
      "Bad (Below 580)"
    ];
    
    if (disqualifyingScores.includes(choice)) {
      updateSurveyData("disqualificationFlag", true);
    }
    
    // Move to next screen after slight delay for visual feedback
    setTimeout(() => {
      onNext();
    }, 300);
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What is your current credit score?",
      excellent: "Excellent (720+)",
      good: "Good (680-719)",
      fair: "Fair (660-679)",
      belowAverage: "Below average (620-659)",
      poor: "Poor (580-619)",
      bad: "Bad (Below 580)",
      noCredit: "No Credit",
      back: "Back"
    },
    es: {
      title: "¿Cuál es su puntaje de crédito actual?",
      excellent: "Excelente (720+)",
      good: "Bueno (680-719)",
      fair: "Regular (660-679)",
      belowAverage: "Por debajo del promedio (620-659)",
      poor: "Deficiente (580-619)",
      bad: "Malo (Por debajo de 580)",
      noCredit: "Sin Crédito",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  // Define credit score options with their styling
  const creditScoreOptions = [
    { 
      value: "Excellent (720+)", 
      label: t.excellent,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-green-600" />
    },
    { 
      value: "Good (680-719)", 
      label: t.good,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-green-500" />
    },
    { 
      value: "Fair (660-679)", 
      label: t.fair,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-green-400" />
    },
    { 
      value: "Below average (620-659)", 
      label: t.belowAverage,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-amber-500" />
    },
    { 
      value: "Poor (580-619)", 
      label: t.poor,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-orange-500" />
    },
    { 
      value: "Bad (Below 580)", 
      label: t.bad,
      classes: "bg-white hover:bg-[#f0f0f0] text-[#d03c0b] border-[#d03c0b]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-red-500" />
    },
    { 
      value: "No Credit", 
      label: t.noCredit,
      classes: "bg-white hover:bg-[#f4f7ee] text-[#3f4f24] border-[#3f4f24]",
      icon: <BadgeCheckIcon className="w-5 h-5 mr-2 text-gray-500" />
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
            {creditScoreOptions.map((option) => (
              <Button
                key={option.value}
                className={`py-4 px-4 text-base rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-start ${option.classes} ${selectedChoice === option.value ? 'ring-2 ring-offset-1 ring-[#D4A017]' : ''}`}
                onClick={() => handleSelectChoice(option.value)}
              >
                {option.icon}
                {option.label}
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