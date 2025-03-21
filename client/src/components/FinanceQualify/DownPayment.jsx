"use client";

import React, { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSignIcon } from "lucide-react";
import PaymentCalculatorFront from "@/components/PaymentCalculator/PaymentCalculatorFront";

export default function DownPayment({ surveyData, updateSurveyData, propertyData, onNext, onBack }) {
  const [choices, setChoices] = useState([]);
  const [showPaymentPlans, setShowPaymentPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  useEffect(() => {
    // Extract property price from survey data or property data
    const propertyPrice = propertyData?.askingPrice || parseInt(surveyData.property_price, 10) || 100000;
    
    // Calculate different down payment percentages
    const downPaymentOptions = [
      { percentage: 10, value: propertyPrice * 0.1, display: `10% ($${formatCurrency(propertyPrice * 0.1)})` },
      { percentage: 15, value: propertyPrice * 0.15, display: `15% ($${formatCurrency(propertyPrice * 0.15)})` },
      { percentage: 20, value: propertyPrice * 0.2, display: `20% ($${formatCurrency(propertyPrice * 0.2)})` },
      { percentage: 25, value: propertyPrice * 0.25, display: `25% ($${formatCurrency(propertyPrice * 0.25)})` },
      { percentage: "More than 25%", value: null, display: "More than 25%" }
    ];
    
    setChoices(downPaymentOptions);
  }, [surveyData.property_price, propertyData]);
  
  // Format currency helper
  const formatCurrency = (value) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Handle selection of down payment option
  const handleDownPaymentSelection = (choice) => {
    updateSurveyData("down_payment", choice.display);
    
    // Check if disqualification is needed (10% down payment)
    if (choice.percentage === 10) {
      updateSurveyData("disqualificationFlag", true);
    }
    
    // If financing is available for this property, show payment plans
    if (propertyData && propertyData.financing === "Available") {
      setShowPaymentPlans(true);
    } else {
      // If no financing available, just go to next step
      onNext();
    }
  };

  // Handle selection of payment plan
  const handlePlanSelection = (planNumber) => {
    setSelectedPlan(planNumber);
    updateSurveyData("payment_plan", planNumber);
    
    // Store the selected plan's details
    const planKey = planNumber === "1" ? "One" : (planNumber === "2" ? "Two" : "Three");
    updateSurveyData("selected_monthly_payment", propertyData[`monthlyPayment${planKey}`]);
    updateSurveyData("selected_interest_rate", propertyData[`interest${planKey}`]);
    updateSurveyData("selected_down_payment", propertyData[`downPayment${planKey}`]);
    
    // Proceed to next step
    onNext();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "How much of a down payment are you able to make?",
      choosePaymentPlan: "Choose a Payment Plan",
      selectPlan: "Select this Plan",
      back: "Back",
      next: "Next"
    },
    es: {
      title: "¿Cuánto puede pagar como pago inicial?",
      choosePaymentPlan: "Elija un plan de pago",
      selectPlan: "Seleccionar este plan",
      back: "Atrás",
      next: "Siguiente"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        {!showPaymentPlans ? (
          // Down Payment Selection View
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
              {t.title}
            </h2>
            
            <div className="grid grid-cols-1 gap-4 mt-8">
              {choices.map((choice, index) => (
                <Button
                  key={index}
                  className="py-6 px-4 bg-white hover:bg-[#f4f7ee] text-[#3f4f24] text-lg rounded-lg border border-[#3f4f24] transition-all duration-200 hover:shadow-md flex items-center justify-center"
                  onClick={() => handleDownPaymentSelection(choice)}
                >
                  <DollarSignIcon className="w-5 h-5 mr-2 text-[#D4A017]" />
                  {choice.display}
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
        ) : (
          // Payment Plan Selection View
          <div>
            <h2 className="text-2xl font-semibold text-[#324c48] mb-6 text-center">
              {t.choosePaymentPlan}
            </h2>
            
            {/* Payment Calculator Component */}
            <div className="mb-6">
              <PaymentCalculatorFront propertyData={propertyData} />
            </div>
            
            {/* Plan Confirmation Button */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
                onClick={() => setShowPaymentPlans(false)}
              >
                {t.back}
              </Button>
              
              <Button
                className="bg-[#D4A017] hover:bg-[#b88914] text-white"
                onClick={() => onNext()}
              >
                {t.next}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}