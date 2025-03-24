import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, Download, Home } from "lucide-react";

export default function SurveyCompletion({ surveyData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const disqualified = !surveyData.qualified;

  // Simulate processing time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Translation object based on selected language
  const translations = {
    en: {
      evaluating: "Evaluating Your Application...",
      congratulations: "Congratulations",
      completed: "You're Pre-Qualified!",
      review: "We'll review your application and contact you shortly to discuss next steps for purchasing this property.",
      sorry: "We're Sorry",
      notQualified: "You Currently Do Not Qualify For Our Seller Finance Program",
      thanks: "Thank you for your interest in our property.",
      alternatives: "Consider these alternatives:",
      alt1: "Increase your down payment to at least 10% of the property price",
      alt2: "Improve your credit score (aim for 660+)",
      alt3: "Establish a longer history of consistent income",
      contact: "Contact our team to discuss other options",
      backToProperties: "Back to Properties",
      downloadResults: "Download Results",
      contactUs: "Contact Our Team"
    },
    es: {
      evaluating: "Evaluando su solicitud...",
      congratulations: "¡Felicidades!",
      completed: "¡Está pre-calificado!",
      review: "Revisaremos su solicitud y nos comunicaremos con usted en breve para hablar sobre los próximos pasos para la compra de esta propiedad.",
      sorry: "Lo sentimos",
      notQualified: "Actualmente no califica para nuestro programa de financiación del vendedor",
      thanks: "Gracias por su interés en nuestra propiedad.",
      alternatives: "Considere estas alternativas:",
      alt1: "Aumente su pago inicial a al menos el 10% del precio de la propiedad",
      alt2: "Mejore su puntaje de crédito (apunte a 660+)",
      alt3: "Establezca un historial más largo de ingresos constantes",
      contact: "Contacte a nuestro equipo para hablar sobre otras opciones",
      backToProperties: "Volver a Propiedades",
      downloadResults: "Descargar Resultados",
      contactUs: "Contactar a Nuestro Equipo"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];
  
  // First name to personalize the message
  const firstName = surveyData.firstName || "";

  // Function to generate a PDF report (this would be implemented with a PDF library in practice)
  const handleDownloadResults = () => {
    alert("This feature would generate a PDF qualification report showing the user's qualification status and details.");
    // In a real implementation, you'd use a library like jsPDF or call a backend endpoint
  };
  
  // Function to navigate to contact page
  const handleContactTeam = () => {
    navigate("/support");
  };

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
                <div className="space-y-6">
                  {/* Disqualified Result */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#f4f7ee] flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-[#3f4f24]">!</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#324c48] mb-2">
                      {t.sorry} {firstName && `${firstName}`}
                    </h2>
                    <p className="text-xl font-medium text-gray-700 mb-2">
                      {t.notQualified}
                    </p>
                    <p className="text-lg text-[#324c48] mb-4">
                      {t.thanks}
                    </p>
                  </div>
                  
                  {/* Alternatives */}
                  <div className="bg-[#f4f7ee] rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-[#3f4f24] mb-2">{t.alternatives}</h3>
                    <ul className="space-y-2 text-[#324c48]">
                      {/* <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{t.alt1}</span>
                      </li> */}
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{t.alt2}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{t.alt3}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{t.contact}</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      className="bg-[#324c48] hover:bg-[#3c5d58] text-white"
                      onClick={() => navigate("/properties")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {t.backToProperties}
                    </Button>
                    <Button
                      className="bg-[#D4A017] hover:bg-[#b88914] text-white"
                      onClick={handleContactTeam}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {t.contactUs}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Qualified Result */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#f4f7ee] flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-[#3f4f24]">✓</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#3f4f24] mb-2">
                      {t.congratulations} {firstName && `${firstName}!`}
                    </h2>
                    <p className="text-xl font-medium text-[#324c48] mb-2">
                      {t.completed}
                    </p>
                    <p className="text-lg text-[#324c48] max-w-lg mx-auto">
                      {t.review}
                    </p>
                  </div>
                  
                  {/* Display Selected Payment Plan Details */}
                  {surveyData.selected_plan && (
                    <div className="bg-[#f4f7ee] rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-[#3f4f24] mb-2">Selected Payment Plan Details</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-medium">Plan:</div>
                        <div>Plan {surveyData.selected_plan}</div>
                        
                        <div className="font-medium">Down Payment:</div>
                        <div>${parseFloat(surveyData.down_payment || 0).toLocaleString()}</div>
                        
                        <div className="font-medium">Monthly Payment:</div>
                        <div>${parseFloat(surveyData.monthly_payment || 0).toLocaleString()}/mo</div>
                        
                        <div className="font-medium">Interest Rate:</div>
                        <div>{surveyData.interest_rate}%</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      className="bg-[#324c48] hover:bg-[#3c5d58] text-white"
                      onClick={handleDownloadResults}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t.downloadResults}
                    </Button>
                    <Button
                      className="bg-[#D4A017] hover:bg-[#b88914] text-white"
                      onClick={() => navigate("/properties")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {t.backToProperties}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}