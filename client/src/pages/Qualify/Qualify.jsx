import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  
  // Define the initial survey data state
  const [formData, setFormData] = useState({
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
          setFormData(prev => ({
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
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle moving to the next step
  const handleNext = () => {
    // Handle conditional navigation based on user selections
    if (steps[currentStep].route === "employment_status") {
      // Skip to appropriate income verification step based on employment status
      const nextRoutes = {
        "Employed": getStepIndexByRoute("verify_income_employed"),
        "Self-Employed 1099": getStepIndexByRoute("verify_income_self_employed"),
        "Not Employed": getStepIndexByRoute("verify_income_not_employed"),
        "Retired": getStepIndexByRoute("verify_income_retired")
      };
      
      const employmentStatus = formData.employment_status;
      const nextStep = nextRoutes[employmentStatus];
      
      if (nextStep !== -1) {
        setCurrentStep(nextStep);
        return;
      }
    }
    
    // Skip total_monthly_payments if no open credit lines
    if (steps[currentStep].route === "open_credit_lines" && formData.open_credit_lines === "No, I don't") {
      const grossIncomeStep = getStepIndexByRoute("gross_annual_income");
      if (grossIncomeStep !== -1) {
        setCurrentStep(grossIncomeStep);
        return;
      }
    }
    
    // Default behavior - go to next step
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  // Handle moving to the previous step
  const handleBack = () => {
    // Handle special back navigation cases
    if (["verify_income_employed", "verify_income_self_employed", 
         "verify_income_not_employed", "verify_income_retired"].includes(steps[currentStep].route)) {
      // Always go back to employment status from any income verification step
      const employmentStep = getStepIndexByRoute("employment_status");
      if (employmentStep !== -1) {
        setCurrentStep(employmentStep);
        return;
      }
    }
    
    // Handle going back from gross_annual_income to appropriate step
    if (steps[currentStep].route === "gross_annual_income") {
      if (formData.open_credit_lines === "No, I don't") {
        const openCreditStep = getStepIndexByRoute("open_credit_lines");
        if (openCreditStep !== -1) {
          setCurrentStep(openCreditStep);
          return;
        }
      }
    }
    
    // Default behavior - go to previous step
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Get step index by route name
  const getStepIndexByRoute = (routeName) => {
    return steps.findIndex(step => step.route === routeName);
  };

  // Apply qualification rules to determine if user is qualified
  const evaluateQualification = () => {
    // Automatic disqualification criteria
    const disqualifyingConditions = [
      // Credit score criteria
      ["current_credit_score", ["Below average (620-659)", "Poor (580-619)", "Bad (Below 580)"]],
      // Payment history criteria
      ["current_on_all_payments", ["No"]],
      // Financial criteria
      ["gross_annual_income", ["Less than $30,000", "$30,000 - $50,000", "$50,000 - $75,000"]],
      // Legal/Credit issues
      ["foreclosure_forbearance", ["Yes"]],
      ["declared_bankruptcy", ["Yes"]],
      ["liens_or_judgments", ["Yes"]],
      // Income verification
      ["verify_income", ["No, I cannot", "No, I don't"]],
      ["income_history", ["No"]]
    ];
    
    // Check each disqualifying condition
    for (const [field, disqualifyingValues] of disqualifyingConditions) {
      if (disqualifyingValues.includes(formData[field])) {
        return false; // Disqualified
      }
    }
    
    // Down payment check - must be at least 10% of property price
    if (formData.down_payment) {
      const downPayment = parseFloat(formData.down_payment);
      const propertyPrice = parseFloat(formData.property_price || 0);
      if (downPayment < propertyPrice * 0.1) {
        return false; // Disqualified due to insufficient down payment
      }
    }
    
    // If no disqualifying conditions found, user is qualified
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Determine qualification status
      const isQualified = evaluateQualification();
      
      // Prepare submission data
      const submissionData = {
        ...formData,
        qualified: isQualified,
        submission_date: new Date().toISOString()
      };
      
      // Log the submission data
      console.log("Submitting qualification data:", submissionData);
      
      // Submit to backend (uncomment when ready)
      // const response = await axios.post(
      //   `${import.meta.env.VITE_SERVER_URL}/api/qualification/submit`, 
      //   submissionData,
      //   { withCredentials: true }
      // );
      
      // Navigate to completion step with qualification result
      setFormData(prev => ({
        ...prev,
        qualified: isQualified,
      }));
      
      // Move to completion step
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error("Error submitting qualification data:", error);
      // Error handling could be added here
    }
  };

  // Define all steps with their components and routes
  const steps = [
    {
      title: "Language Selection",
      route: "language_selection",
      component: (
        <LanguageSelection 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext}
        />
      ),
    },
    {
      title: "Property Usage",
      route: "home_usage",
      component: (
        <HomeUsage 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Real Estate Agent",
      route: "real_estate_agent",
      component: (
        <RealEstateAgent 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Purchase Timing",
      route: "home_purchase_timing",
      component: (
        <HomePurchaseTiming 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Home Ownership",
      route: "current_home_ownership",
      component: (
        <CurrentHomeOwnership 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Payment History",
      route: "current_on_all_payments",
      component: (
        <CurrentOnAllPayments 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Down Payment",
      route: "down_payment",
      component: (
        <DownPayment 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Employment Status",
      route: "employment_status",
      component: (
        <EmploymentStatus 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Verify Income (Employed)",
      route: "verify_income_employed",
      component: (
        <VerifyIncomeEmployed 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Verify Income (Self-Employed)",
      route: "verify_income_self_employed",
      component: (
        <VerifyIncomeSelfEmployed 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Verify Income (Not Employed)",
      route: "verify_income_not_employed",
      component: (
        <VerifyIncomeNotEmployed 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Verify Income (Retired)",
      route: "verify_income_retired",
      component: (
        <VerifyIncomeRetired 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Income History",
      route: "income_history",
      component: (
        <IncomeHistory 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Open Credit Lines",
      route: "open_credit_lines",
      component: (
        <OpenCreditLines 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Total Monthly Payments",
      route: "total_monthly_payments",
      component: (
        <TotalMonthlyPayments 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Gross Annual Income",
      route: "gross_annual_income",
      component: (
        <GrossAnnualIncome 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Foreclosure or Forbearance",
      route: "foreclosure_forbearance",
      component: (
        <ForeclosureForbearance 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Bankruptcy History",
      route: "declared_bankruptcy",
      component: (
        <DeclaredBankruptcy 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Credit Score",
      route: "current_credit_score",
      component: (
        <CurrentCreditScore 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Liens or Judgments",
      route: "liens_or_judgments",
      component: (
        <LiensOrJudgments 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Contact Information",
      route: "user_info",
      component: (
        <UserInfo 
          surveyData={formData} 
          updateSurveyData={handleChange} 
          onSubmit={handleSubmit} 
          onBack={handleBack}
        />
      ),
    },
    {
      title: "Completion",
      route: "survey_completion",
      component: (
        <SurveyCompletion 
          surveyData={formData} 
          disqualified={!formData.qualified}
        />
      ),
    },
  ];

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

  // Show loading state while fetching property data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

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
      
      {/* Development aids - only visible in development */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="font-semibold cursor-pointer">Debug: Form Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(formData, null, 2)}
            </pre>
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