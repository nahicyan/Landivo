"use client";

import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeUsage({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection
  const handleSelection = (usage) => {
    updateSurveyData("home_usage", usage);
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "How will you use your new land?",
      primaryResidence: "To build a primary residence",
      secondaryVacation: "Secondary/Vacation Land",
      investment: "Investment Property",
      back: "Back"
    },
    es: {
      title: "¿Cómo utilizará su nueva propiedad?",
      primaryResidence: "Para construir una residencia principal",
      secondaryVacation: "Terreno secundario / de vacaciones",
      investment: "Propiedad de inversión",
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
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("To build a primary residence")}
            >
              <span className="mr-2">🏠</span> {t.primaryResidence}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Secondary/Vacation Land")}
            >
              <span className="mr-2">🏞️</span> {t.secondaryVacation}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Investment Property")}
            >
              <span className="mr-2">💼</span> {t.investment}
            </Button>
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