"use client";

import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, UserIcon, WalletIcon, HeartPulseIcon } from "lucide-react";

export default function EmploymentStatus({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection of employment status
  const handleSelection = (status) => {
    updateSurveyData("employment_status", status);
    
    // Handle different routes based on employment status
    switch (status) {
      case "Employed":
        updateSurveyData("next_route", "verify_income_employed");
        break;
      case "Self-Employed 1099":
        updateSurveyData("next_route", "verify_income_self_employed");
        break;
      case "Not Employed":
        updateSurveyData("next_route", "verify_income_not_employed");
        break;
      case "Retired":
        updateSurveyData("next_route", "verify_income_retired");
        break;
      default:
        break;
    }
    
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "What is your current employment status?",
      employed: "Employed",
      notEmployed: "Not Employed",
      selfEmployed: "Self-Employed 1099",
      retired: "Retired",
      back: "Back"
    },
    es: {
      title: "¿Cuál es su situación laboral actual?",
      employed: "Empleado",
      notEmployed: "Desempleado",
      selfEmployed: "Autónomo (1099)",
      retired: "Jubilado",
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Employed")}
            >
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              {t.employed}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Not Employed")}
            >
              <UserIcon className="w-5 h-5 mr-2" />
              {t.notEmployed}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Self-Employed 1099")}
            >
              <WalletIcon className="w-5 h-5 mr-2" />
              {t.selfEmployed}
            </Button>
            
            <Button
              className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={() => handleSelection("Retired")}
            >
              <HeartPulseIcon className="w-5 h-5 mr-2" />
              {t.retired}
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