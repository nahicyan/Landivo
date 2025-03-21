"use client";

import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SurveyCompletion({ surveyData, disqualified }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate evaluation process
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Translation object based on selected language
  const translations = {
    en: {
      evaluating: "Evaluating Your Application...",
      congratulations: "Congratulations",
      completed: "You have completed the application!",
      review: "We will review your application and reach out to you soon.",
      sorry: "Sorry",
      notQualified: "You Do Not Qualify For Our Seller Finance Program",
      thanks: "Thank you for your interest.",
      backToProperties: "Back to Properties"
    },
    es: {
      evaluating: "Evaluando su solicitud...",
      congratulations: "Felicidades",
      completed: "¡Ha completado la solicitud!",
      review: "Revisaremos su solicitud y nos comunicaremos con usted pronto.",
      sorry: "Lo sentimos",
      notQualified: "No califica para nuestro programa de financiación del vendedor",
      thanks: "Gracias por su interés.",
      backToProperties: "Volver a Propiedades"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];
  
  // First name to personalize the message
  const firstName = surveyData.first_name || "";

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          {loading ? (
            <>
              <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
                {t.evaluating}
              </h2>
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4A017]"></div>
              </div>
            </>
          ) : (
            <>
              {disqualified ? (
                <>
                  <h2 className="text-2xl font-semibold text-[#d03c0b] mb-6">
                    {t.sorry} {firstName && `${firstName},`} {t.notQualified}
                  </h2>
                  <p className="text-lg text-[#324c48] mb-8">
                    {t.thanks}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-[#3f4f24] mb-6">
                    {t.congratulations} {firstName && `${firstName}!`} {t.completed}
                  </h2>
                  <p className="text-lg text-[#324c48] mb-8">
                    {t.review}
                  </p>
                </>
              )}
              
              <div className="mt-8">
                <Button
                  className="bg-[#324c48] hover:bg-[#3c5d58] text-white"
                  onClick={() => navigate("/properties")}
                >
                  {t.backToProperties}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}