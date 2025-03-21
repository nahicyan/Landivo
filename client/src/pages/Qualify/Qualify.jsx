"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Survey components
import LanguageSelection from "@/components/FinanceQualify/LanguageSelection";
import HomeUsage from "@/components/FinanceQualify/HomeUsage";
import RealEstateAgent from "@/components/FinanceQualify/RealEstateAgent";
// import HomePurchaseTiming from "@/components/QualifySurvey/HomePurchaseTiming";
// import CurrentHomeOwnership from "@/components/QualifySurvey/CurrentHomeOwnership";
// import CurrentOnAllPayments from "@/components/QualifySurvey/CurrentOnAllPayments";
// import DownPayment from "@/components/QualifySurvey/DownPayment";
import UserInfo from "@/components/FinanceQualify/UserInfo";
import SurveyCompletion from "@/components/FinanceQualify/SurveyCompletion";

export default function Qualify() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    language: "en",
    property_price: "",
    home_usage: "",
    real_estate_agent: "",
    home_purchase_timing: "",
    current_home_ownership: "",
    current_on_all_payments: "",
    down_payment: "",
    employment_status: "",
    verify_income: "",
    income_history: "",
    open_credit_lines: "",
    total_monthly_payments: "",
    gross_annual_income: "",
    foreclosure_forbearance: "",
    declared_bankruptcy: "",
    current_credit_score: "",
    liens_or_judgments: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    disqualificationFlag: false
  });

  // Update survey data
  const updateSurveyData = (key, value) => {
    setSurveyData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    setStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  // Navigate to previous step
  const prevStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 0));
  };

  // Submission handler
  const handleSubmit = async () => {
    try {
      // Here you'd normally submit the data to your backend
      console.log("Survey data submitted:", surveyData);
      
      // Navigate to the confirmation step
      setStep(steps.length - 1);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  // All survey steps
  const steps = [
    {
      title: "Language Selection",
      component: (
        <LanguageSelection 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep}
        />
      ),
    },
    {
      title: "Property Usage",
      component: (
        <HomeUsage 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Real Estate Agent",
      component: (
        <RealEstateAgent 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    // {
    //   title: "Purchase Timing",
    //   component: (
    //     <HomePurchaseTiming 
    //       surveyData={surveyData} 
    //       updateSurveyData={updateSurveyData} 
    //       onNext={nextStep} 
    //       onBack={prevStep}
    //     />
    //   ),
    // },
    // {
    //   title: "Home Ownership",
    //   component: (
    //     <CurrentHomeOwnership 
    //       surveyData={surveyData} 
    //       updateSurveyData={updateSurveyData} 
    //       onNext={nextStep} 
    //       onBack={prevStep}
    //     />
    //   ),
    // },
    // {
    //   title: "Payment History",
    //   component: (
    //     <CurrentOnAllPayments 
    //       surveyData={surveyData} 
    //       updateSurveyData={updateSurveyData} 
    //       onNext={nextStep} 
    //       onBack={prevStep}
    //     />
    //   ),
    // },
    // {
    //   title: "Down Payment",
    //   component: (
    //     <DownPayment 
    //       surveyData={surveyData} 
    //       updateSurveyData={updateSurveyData} 
    //       onNext={nextStep} 
    //       onBack={prevStep}
    //     />
    //   ),
    // },
    {
      title: "Your Information",
      component: (
        <UserInfo 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onSubmit={handleSubmit} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Completed",
      component: (
        <SurveyCompletion 
          surveyData={surveyData} 
          disqualified={surveyData.disqualificationFlag}
        />
      ),
    },
  ];

  // Step indicator component
  const StepIndicator = ({ currentStep }) => {
    return (
      <div className="w-full flex items-center justify-between mb-8 px-4">
        {[
          "Property",
          "Timeline",
          "Details",
          "Wrap-up"
        ].map((item, index) => {
          const stepPosition = Math.floor((currentStep / (steps.length - 1)) * 3);
          const isActive = index === stepPosition;
          const isCompleted = index < stepPosition;

          return (
            <React.Fragment key={index}>
              {/* Circle with checkmark or dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-[#3f4f24] bg-[#3f4f24] text-white"
                      : isActive
                      ? "border-[#3f4f24] bg-[#f4f7ee] text-[#3f4f24]"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    ""
                  )}
                </div>

                {/* Step title */}
                <span
                  className={`text-xs mt-1 text-center ${
                    isCompleted || isActive
                      ? "font-semibold text-[#3f4f24]"
                      : "text-gray-500"
                  }`}
                >
                  {item}
                </span>
              </div>

              {/* Connector line */}
              {index < 3 && (
                <div 
                  className={`w-full h-[2px] ${
                    index < stepPosition 
                      ? "bg-[#3f4f24]" 
                      : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FDF8F2] min-h-screen">
      {/* Progress Indicator */}
      <StepIndicator currentStep={step} />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg mx-auto max-w-2xl min-h-[400px]"
        >
          {steps[step].component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}