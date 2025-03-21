import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentCalculatorFront from "@/components/PaymentCalculator/PaymentCalculatorFront";

export default function DownPayment({ propertyData, onNext, onBack }) {
  // State to track selected payment plan
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Handle selection of payment plan
  const handlePlanSelection = (planNumber) => {
    setSelectedPlan(planNumber);
    
    // Proceed to next step
    onNext();
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div>
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6 text-center">
            Choose a Payment Plan
          </h2>
          
          {/* Payment Calculator Component */}
          <div className="mb-6">
            <PaymentCalculatorFront propertyData={propertyData} />
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
              onClick={onBack}
            >
              Back
            </Button>
            
            <Button
              className="bg-[#D4A017] hover:bg-[#b88914] text-white"
              onClick={() => onNext()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}