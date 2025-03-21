import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { getProperty } from "@/utils/api";

// Import all survey components
import LanguageSelection from "@/components/FinanceQualify/LanguageSelection";
import HomeUsage from "@/components/FinanceQualify/HomeUsage";
import RealEstateAgent from "@/components/FinanceQualify/RealEstateAgent";
import HomePurchaseTiming from "@/components/FinanceQualify/HomePurchaseTiming";
import CurrentHomeOwnership from "@/components/FinanceQualify/CurrentHomeOwnership";
import CurrentOnAllPayments from "@/components/FinanceQualify/CurrentOnAllPayments";
import DownPayment from "@/components/FinanceQualify/DownPayment";
import EmploymentStatus from "@/components/FinanceQualify/EmploymentStatus";
import VerifyIncomeEmployed from "@/components/FinanceQualify/VerifyIncomeEmployed";
import VerifyIncomeSelfEmployed from "@/components/FinanceQualify/VerifyIncomeSelfEmployed";
import VerifyIncomeNotEmployed from "@/components/FinanceQualify/VerifyIncomeNotEmployed";
import VerifyIncomeRetired from "@/components/FinanceQualify/VerifyIncomeRetired";
import IncomeHistory from "@/components/FinanceQualify/IncomeHistory";
import OpenCreditLines from "@/components/FinanceQualify/OpenCreditLines";
import TotalMonthlyPayments from "@/components/FinanceQualify/TotalMonthlyPayments";
import GrossAnnualIncome from "@/components/FinanceQualify/GrossAnnualIncome";
import ForeclosureForbearance from "@/components/FinanceQualify/ForeclosureForbearance";
import DeclaredBankruptcy from "@/components/FinanceQualify/DeclaredBankruptcy";
import CurrentCreditScore from "@/components/FinanceQualify/CurrentCreditScore";
import LiensOrJudgments from "@/components/FinanceQualify/LiensOrJudgments";
import UserInfo from "@/components/FinanceQualify/UserInfo";
import SurveyCompletion from "@/components/FinanceQualify/SurveyCompletion";
import { PuffLoader } from "react-spinners";

export default function Qualify() {
  const navigate = useNavigate();
  const { propertyId } = useParams(); // Get property ID from URL
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState({
    language: "en",
    disqualificationFlag: false,
    // Will be populated with property data when fetched
  });

  // Fetch property data if propertyId is available
  useEffect(() => {
    if (propertyId) {
      setLoading(true);
      getProperty(propertyId)
        .then((data) => {
          setPropertyData(data);
          
          // Initialize survey data with property information
          setSurveyData(prev => ({
            ...prev,
            property_id: propertyId,
            property_price: data.askingPrice?.toString() || "100000",
            property_title: data.title || "",
            property_location: `${data.city}, ${data.state}` || "",
            financing_available: data.financing === "Available",
            propertyData: data, // Store the entire property data object
          }));
          
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching property:", err);
          setLoading(false);
          // Set default values in case of error
          setSurveyData(prev => ({
            ...prev,
            property_price: "100000",
          }));
        });
    } else {
      // No propertyId, just remove loading state
      setLoading(false);
    }
  }, [propertyId]);

  // Update survey data
  const updateSurveyData = (key, value) => {
    setSurveyData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    // If there's a specific next route defined by a component
    if (surveyData.next_route) {
      const routeIndex = getStepIndexByRoute(surveyData.next_route);
      if (routeIndex !== -1) {
        setCurrentStep(routeIndex);
        // Clear the next_route after using it
        updateSurveyData("next_route", null);
        return;
      }
    }
    
    // Default behavior: go to next step
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Get step index by route name
  const getStepIndexByRoute = (routeName) => {
    return steps.findIndex(step => step.route === routeName);
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      // Here you would normally send data to your backend
      console.log("Submitting survey data:", surveyData);
      
      // You could add an API call here:
      /*
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/qualify/submit`, 
        surveyData, 
        { withCredentials: true }
      );
      */
      
      // Move to completion step
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error submitting qualification data:", error);
      // You could add error handling here
    }
  };

  // Define all survey steps
  const steps = [
    {
      title: "Language Selection",
      route: "language_selection",
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
      route: "home_usage",
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
      route: "real_estate_agent",
      component: (
        <RealEstateAgent 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Purchase Timing",
      route: "home_purchase_timing",
      component: (
        <HomePurchaseTiming 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Home Ownership",
      route: "current_home_ownership",
      component: (
        <CurrentHomeOwnership 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Payment History",
      route: "current_on_all_payments",
      component: (
        <CurrentOnAllPayments 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Down Payment",
      route: "down_payment",
      component: (
        <DownPayment 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Employment Status",
      route: "employment_status",
      component: (
        <EmploymentStatus 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Verify Income (Employed)",
      route: "verify_income_employed",
      component: (
        <VerifyIncomeEmployed 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Verify Income (Self-Employed)",
      route: "verify_income_self_employed",
      component: (
        <VerifyIncomeSelfEmployed 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Verify Income (Not Employed)",
      route: "verify_income_not_employed",
      component: (
        <VerifyIncomeNotEmployed 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Verify Income (Retired)",
      route: "verify_income_retired",
      component: (
        <VerifyIncomeRetired 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Income History",
      route: "income_history",
      component: (
        <IncomeHistory 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Open Credit Lines",
      route: "open_credit_lines",
      component: (
        <OpenCreditLines 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Total Monthly Payments",
      route: "total_monthly_payments",
      component: (
        <TotalMonthlyPayments 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Gross Annual Income",
      route: "gross_annual_income",
      component: (
        <GrossAnnualIncome 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Foreclosure or Forbearance",
      route: "foreclosure_forbearance",
      component: (
        <ForeclosureForbearance 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Bankruptcy History",
      route: "declared_bankruptcy",
      component: (
        <DeclaredBankruptcy 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Credit Score",
      route: "current_credit_score",
      component: (
        <CurrentCreditScore 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Liens or Judgments",
      route: "liens_or_judgments",
      component: (
        <LiensOrJudgments 
          surveyData={surveyData} 
          updateSurveyData={updateSurveyData} 
          onNext={nextStep} 
          onBack={prevStep}
        />
      ),
    },
    {
      title: "Contact Information",
      route: "user_info",
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
      title: "Completion",
      route: "survey_completion",
      component: (
        <SurveyCompletion 
          surveyData={surveyData} 
          disqualified={surveyData.disqualificationFlag}
        />
      ),
    },
  ];

  // Logic to skip irrelevant steps based on employment status
  useEffect(() => {
    // If the current step is employment status and a selection was just made
    if (steps[currentStep].route === "employment_status" && surveyData.employment_status) {
      // The next step will be determined by the next_route set in the EmploymentStatus component
      // The nextStep function will handle routing to the correct verification step
    }
  }, [surveyData.employment_status, currentStep]);

  // Progress indicator component
  const StepIndicator = ({ currentStep }) => {
    // Calculate progress percentage
    const progress = Math.floor((currentStep / (steps.length - 1)) * 100);
    
    // Define progress stages with their corresponding step ranges
    const stages = [
      { name: "Property", range: [0, 6] },    // Steps 0-6
      { name: "Financial", range: [7, 14] },  // Steps 7-14
      { name: "Credit", range: [15, 19] },    // Steps 15-19
      { name: "Complete", range: [20, 21] }   // Steps 20-21
    ];
    
    // Determine current stage
    const currentStageIndex = stages.findIndex(
      stage => currentStep >= stage.range[0] && currentStep <= stage.range[1]
    );

    return (
      <div className="w-full mb-8">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className="bg-[#3f4f24] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Stage indicators */}
        <div className="flex justify-between px-2">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-4 h-4 rounded-full mb-1 ${
                  index <= currentStageIndex 
                    ? 'bg-[#3f4f24]' 
                    : 'bg-gray-300'
                }`}
              ></div>
              <span 
                className={`text-xs ${
                  index <= currentStageIndex 
                    ? 'text-[#3f4f24] font-medium' 
                    : 'text-gray-500'
                }`}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Skip logic for certain steps based on other answers
  const shouldSkipCurrentStep = () => {
    const currentRoute = steps[currentStep].route;
    
    // Skip employment-specific verification steps based on employment status
    if (currentRoute === "verify_income_employed" && surveyData.employment_status !== "Employed") {
      return true;
    }
    if (currentRoute === "verify_income_self_employed" && surveyData.employment_status !== "Self-Employed 1099") {
      return true;
    }
    if (currentRoute === "verify_income_not_employed" && surveyData.employment_status !== "Not Employed") {
      return true;
    }
    if (currentRoute === "verify_income_retired" && surveyData.employment_status !== "Retired") {
      return true;
    }
    
    // Skip total monthly payments step if no open credit lines
    if (currentRoute === "total_monthly_payments" && surveyData.open_credit_lines !== "Yes, I do") {
      return true;
    }
    
    return false;
  };

  // Effect to automatically skip steps based on logic
  useEffect(() => {
    if (shouldSkipCurrentStep()) {
      nextStep();
    }
  }, [currentStep, surveyData]);

  // Show loading state while fetching property data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  // Property Info Header
  const PropertyHeader = () => {
    if (!propertyData) return null;
    
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 
          className="text-lg font-semibold text-[#3f4f24]"
          dangerouslySetInnerHTML={{ __html: propertyData.title }}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-600">
            {propertyData.streetAddress}, {propertyData.city}, {propertyData.state}
          </p>
          <p className="font-semibold text-[#D4A017]">
            ${propertyData.askingPrice?.toLocaleString() || "N/A"}
          </p>
        </div>
      </div>
    );
  };

  // Enhanced Debug Panel with Payment Plan Information
  const EnhancedDebugPanel = () => {
    const paymentPlanData = {
      selected_plan: surveyData.selected_plan || "Not selected",
      down_payment: surveyData.down_payment || "Not set",
      interest_rate: surveyData.interest_rate || "Not set",
      monthly_payment: surveyData.monthly_payment || "Not set",
    };

    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <details>
          <summary className="font-semibold cursor-pointer">Debug: Current Survey Data</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-60">
            {JSON.stringify(surveyData, null, 2)}
          </pre>
        </details>
        
        <details className="mt-4">
          <summary className="font-semibold cursor-pointer">Debug: Payment Plan Data</summary>
          <div className="mt-2 p-3 bg-white rounded border border-gray-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Data Field</th>
                  <th className="text-left p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-t">Selected Plan</td>
                  <td className="p-2 border-t">{paymentPlanData.selected_plan}</td>
                </tr>
                <tr>
                  <td className="p-2 border-t">Down Payment</td>
                  <td className="p-2 border-t">${paymentPlanData.down_payment}</td>
                </tr>
                <tr>
                  <td className="p-2 border-t">Interest Rate</td>
                  <td className="p-2 border-t">{paymentPlanData.interest_rate}%</td>
                </tr>
                <tr>
                  <td className="p-2 border-t">Monthly Payment</td>
                  <td className="p-2 border-t">${paymentPlanData.monthly_payment}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
        
        {propertyData && (
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Debug: Property Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(propertyData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FDF8F2] min-h-screen">
      {/* Property Header if propertyId is available */}
      {propertyId && <PropertyHeader />}
      
      {/* Progress Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Step Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg mx-auto max-w-2xl min-h-[400px]"
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>
      
      {/* Enhanced Debug Panel (visible only in development) */}
      {import.meta.env.DEV && <EnhancedDebugPanel />}
    </div>
  );
}