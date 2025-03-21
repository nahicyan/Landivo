"use client";

import React from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePurchaseTiming({ surveyData, updateSurveyData, onNext, onBack }) {
  // Handle selection
  const handleSelection = (timing) => {
    updateSurveyData("home_purchase_timing", timing);
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "When are you planning to make your land purchase?",
      immediate: "Immediately: I have a signed purchase agreement",
      asap: "ASAP: I have found a land / Offer pending",
      within30: "Within 30 Days",
      months23: "2-3 Months",
      months36: "3-6 Months",
      months6plus: "6+ Months",
      back: "Back"
    },
    es: {
      title: "¿Cuándo planea realizar la compra de la propiedad?",
      immediate: "Inmediatamente: Tengo un contrato de compra firmado",
      asap: "Lo antes posible: He encontrado una propiedad / Oferta pendiente",
      within30: "En los próximos 30 días",
      months23: "2-3 meses",
      months36: "3-6 meses",
      months6plus: "Más de 6 meses",
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
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("Immediately: I have a signed purchase agreement")}
            >
              {t.immediate}
            </Button>
            
            <Button
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("ASAP: I have found a land / Offer pending")}
            >
              {t.asap}
            </Button>
            
            <Button
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("Within 30 Days")}
            >
              {t.within30}
            </Button>
            
            <Button
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("2-3 Months")}
            >
              {t.months23}
            </Button>
            
            <Button
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("3-6 months")}
            >
              {t.months36}
            </Button>
            
            <Button
              className="py-4 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-base rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md"
              onClick={() => handleSelection("6+ months")}
            >
              {t.months6plus}
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