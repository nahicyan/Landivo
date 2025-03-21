import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import { getProperty } from "@/utils/api";
import axios from "axios";

// Import all qualification step components
import LanguageSelection from "@/components/FinanceQualify/LanguageSelection";
import HomeUsage from "@/components/FinanceQualify/HomeUsage";
import RealEstateAgent from "@/components/FinanceQualify/RealEstateAgent";
import HomePurchaseTiming from "@/components/FinanceQualify/HomePurchaseTiming";
import CurrentHomeOwnership from "@/components/FinanceQualify/CurrentHomeOwnership";
import CurrentOnAllPayments from "@/components/FinanceQualify/CurrentOnAllPayments";
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
import DownPayment from "@/components/FinanceQualify/DownPayment";
import SurveyCompletion from "@/components/FinanceQualify/SurveyCompletion";

export default function Qualify() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define all steps with their components in a standard format
  const steps = [
    { id: "language_selection", component: LanguageSelection },
    { id: "home_usage", component: HomeUsage },
    { id: "real_estate_agent", component: RealEstateAgent },
    { id: "home_purchase_timing", component: HomePurchaseTiming },
    { id: "current_home_ownership", component: CurrentHomeOwnership },
    { id: "current_on_all_payments", component: CurrentOnAllPayments },
    { id: "down_payment", component: DownPayment },
    { id: "employment_status", component: EmploymentStatus },
    { id: "verify_income_employed", component: VerifyIncomeEmployed },
    { id: "verify_income_self_employed", component: VerifyIncomeSelfEmployed },
    { id: "verify_income_not_employed", component: VerifyIncomeNotEmployed },
    { id: "verify_income_retired", component: VerifyIncomeRetired },
    { id: "income_history", component: IncomeHistory },
    { id: "open_credit_lines", component: OpenCreditLines },
    { id: "total_monthly_payments", component: TotalMonthlyPayments },
    { id: "gross_annual_income", component: GrossAnnualIncome },
    { id: "foreclosure_forbearance", component: ForeclosureForbearance },
    { id: "declared_bankruptcy", component: DeclaredBankruptcy },
    { id: "current_credit_score", component: CurrentCreditScore },
    { id: "liens_or_judgments", component: LiensOrJudgments },
    { id: "user_info", component: UserInfo },
    { id: "survey_completion", component: SurveyCompletion }
  ];
  
  // Define initial survey data state
  const [surveyData, setSurveyData] = useState({
    // Property Information
    property_id: "",
    property_price: "",
    property_title: "",
    property_location: "",
    financing_available: false,
    propertyData: null,

    // Survey Responses
    language: "en",
    home_usage: "",
    real_estate_agent: "",
    home_purchase_timing: "",
    current_home_ownership: "",
    current_on_all_payments: "",
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

    // Payment Plan Data
    selected_plan: "",
    down_payment: "",
    interest_rate: "",
    monthly_payment: "",
    loan_amount: "",

    // Contact Information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Fetch property data if propertyId is available
  useEffect(() => {
    if (propertyId) {
      setLoading(true);
      getProperty(propertyId)
        .then((data) => {
          setPropertyData(data);
          
          // Initialize form data with property information
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
        });
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  // Update form data with new field values
  const updateSurveyData = (name, value) => {
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper to find step index by ID
  const getStepIndexById = (stepId) => {
    return steps.findIndex(step => step.id === stepId);
  };

  // Handle navigation to next step with conditional routing
  const handleNext = () => {
    // Handle special routing based on user selections
    if (steps[currentStep].id === "employment_status") {
      // Route to appropriate income verification based on employment status
      const routeMap = {
        "Employed": "verify_income_employed",
        "Self-Employed 1099": "verify_income_self_employed",
        "Not Employed": "verify_income_not_employed",
        "Retired": "verify_income_retired"
      };
      
      const nextStepId = routeMap[surveyData.employment_status];
      if (nextStepId) {
        const nextStepIndex = getStepIndexById(nextStepId);
        if (nextStepIndex !== -1) {
          setCurrentStep(nextStepIndex);
          return;
        }
      }
    }
    
    // Skip total_monthly_payments if no open credit lines
    if (steps[currentStep].id === "open_credit_lines" && surveyData.open_credit_lines === "No, I don't") {
      const grossIncomeStep = getStepIndexById("gross_annual_income");
      if (grossIncomeStep !== -1) {
        setCurrentStep(grossIncomeStep);
        return;
      }
    }
    
    // Default behavior - go to next step
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  // Handle navigation to previous step
  const handleBack = () => {
    // Handle special back navigation cases
    const currentStepId = steps[currentStep].id;
    
    // When going back from income verification steps
    if (["verify_income_employed", "verify_income_self_employed", 
         "verify_income_not_employed", "verify_income_retired"].includes(currentStepId)) {
      // Go back to employment status
      const employmentStep = getStepIndexById("employment_status");
      if (employmentStep !== -1) {
        setCurrentStep(employmentStep);
        return;
      }
    }
    
    // When going back from gross_annual_income after skipping total_monthly_payments
    if (currentStepId === "gross_annual_income" && surveyData.open_credit_lines === "No, I don't") {
      const openCreditStep = getStepIndexById("open_credit_lines");
      if (openCreditStep !== -1) {
        setCurrentStep(openCreditStep);
        return;
      }
    }
    
    // Default behavior - go to previous step
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };

  // Function to evaluate qualification status before submission
  const evaluateQualification = () => {
    // Define disqualification criteria
    const disqualifiers = [
      // Credit score
      surveyData.current_credit_score === "Below average (620-659)" ||
      surveyData.current_credit_score === "Poor (580-619)" ||
      surveyData.current_credit_score === "Bad (Below 580)",
      
      // Payment history
      surveyData.current_on_all_payments === "No",
      
      // Income level
      surveyData.gross_annual_income === "Less than $30,000" ||
      surveyData.gross_annual_income === "$30,000 - $50,000" ||
      surveyData.gross_annual_income === "$50,000 - $75,000",
      
      // Legal/Credit issues
      surveyData.foreclosure_forbearance === "Yes",
      surveyData.declared_bankruptcy === "Yes",
      surveyData.liens_or_judgments === "Yes",
      
      // Income verification
      surveyData.verify_income === "No, I cannot" || 
      surveyData.verify_income === "No, I don't",
      
      // Income history
      surveyData.income_history === "No"
    ];
    
    // Down payment check - must be at least 10% of property price
    let downPaymentDisqualifier = false;
    if (surveyData.down_payment) {
      const downPayment = parseFloat(surveyData.down_payment);
      const propertyPrice = parseFloat(surveyData.property_price || 0);
      downPaymentDisqualifier = downPayment < propertyPrice * 0.1;
    }
    
    // If any disqualifier is true, user is not qualified
    return !disqualifiers.some(condition => condition) && !downPaymentDisqualifier;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Determine qualification status
      const isQualified = evaluateQualification();
      
      // Update survey data with qualification result
      setSurveyData(prev => ({
        ...prev,
        qualified: isQualified,
        submission_date: new Date().toISOString()
      }));
      
      // Log the submission data (for development)
      console.log("Submitting qualification data:", {
        ...surveyData,
        qualified: isQualified,
        submission_date: new Date().toISOString()
      });
      
      // In production, submit to backend:
      // await axios.post(
      //   `${import.meta.env.VITE_SERVER_URL}/api/qualification/submit`, 
      //   { ...surveyData, qualified: isQualified, submission_date: new Date().toISOString() },
      //   { withCredentials: true }
      // );
      
      // Move to completion step
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error submitting qualification data:", error);
      // Error handling could be added here
    }
  };

  // Property Info Header Component
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

  // Progress indicator component
  const StepIndicator = () => {
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

  // Show loading state while fetching property data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  // Get the current step component
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FDF8F2] min-h-screen">
      {/* Property Header if propertyId is available */}
      {propertyId && <PropertyHeader />}
      
      {/* Progress Indicator */}
      <StepIndicator />

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
          <CurrentStepComponent 
            surveyData={surveyData}
            updateSurveyData={updateSurveyData}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Development aids - only visible in development */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="font-semibold cursor-pointer">Debug: Form Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(surveyData, null, 2)}
            </pre>
          </details>
          
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Debug: Navigation</summary>
            <div className="mt-2 p-3 bg-white rounded border border-gray-300">
              <p className="font-semibold">Current Step: {steps[currentStep].id}</p>
              <p className="font-semibold">Progress: {Math.floor((currentStep / (steps.length - 1)) * 100)}%</p>
            </div>
          </details>
          
          <details className="mt-4">
            <summary className="font-semibold cursor-pointer">Debug: Qualification Status</summary>
            <div className="mt-2 p-3 bg-white rounded border border-gray-300">
              <p className="font-semibold">Would Qualify: {evaluateQualification() ? "Yes" : "No"}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}