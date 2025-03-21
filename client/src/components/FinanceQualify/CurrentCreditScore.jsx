import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CurrentCreditScore({ surveyData, updateSurveyData, onNext, onBack }) {
  const [selectedChoice, setSelectedChoice] = useState(surveyData.current_credit_score || null);
  
  // Handle selection
  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    
    // Update the survey data with the selected credit score
    updateSurveyData("current_credit_score", choice);
    
    // Use a slight delay for visual feedback
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

  // Define credit score options
  const creditScoreOptions = [
    { value: "Excellent (720+)", label: t.excellent },
    { value: "Good (680-719)", label: t.good },
    { value: "Fair (660-679)", label: t.fair },
    { value: "Below average (620-659)", label: t.belowAverage },
    { value: "Poor (580-619)", label: t.poor },
    { value: "Bad (Below 580)", label: t.bad }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-black mb-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            {t.title}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {creditScoreOptions.map((option) => (
              <button
                key={option.value}
                className={`
                  py-6 
                  px-4 
                  bg-white 
                  border 
                  border-gray-300
                  rounded-md
                  text-black
                  font-normal
                  text-center
                  hover:bg-gray-50
                  transition-colors
                  ${selectedChoice === option.value ? 'border-gray-500' : ''}
                `}
                style={{ fontFamily: 'Arial, sans-serif' }}
                onClick={() => handleSelectChoice(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              className="text-teal-600 border-none bg-transparent hover:underline font-medium"
              style={{ fontFamily: 'Arial, sans-serif' }}
              onClick={onBack}
            >
              {t.back}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}