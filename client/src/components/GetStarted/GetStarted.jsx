import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiOutlineMail } from "react-icons/hi";
import "./GetStarted.css";

export const GetStarted = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validate email input
    if (!email.trim()) {
      setShowDialog(true);
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // If email is valid, navigate to subscription page
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  const handleDialogSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setShowDialog(false);
    // Navigate to subscription page
    navigate(`/subscription?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="py-12 bg-[#FDF8F2]">
      <div className="max-w-screen-md mx-auto px-4 text-center">
        {/* Heading & Subtext */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#3f4f24] mb-4">
          Join Our Exclusive Buyers List
        </h2>
        <p className="text-[#324c48] mb-6">
          Get notified before everyone else, receive instant discounts on
          properties, and stay up to date with notifications only in the areas
          you care about.
        </p>

        {/* Pricing Display */}
        <div className="flex justify-center items-baseline space-x-3 mb-8">
          <span className="text-xl sm:text-2xl font-medium text-[#324c48] line-through">
            Listed Price
          </span>
          <span className="text-3xl sm:text-4xl font-bold text-[#D4A017]">
            Big Discount
          </span>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#324c48] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
            />
            {error && (
              <Alert variant="destructive" className="mt-2 bg-red-50 text-red-600 border border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-[#324c48] hover:bg-[#3f4f24] text-white font-semibold py-3 rounded-md transition-colors"
          >
            Get Started
          </button>
          <p className="text-[#324c48] text-sm mt-3">
            Your email is 100% confidential and we won't spam you.
          </p>
        </form>
      </div>

      {/* Email Request Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white p-6 rounded-lg border border-[#324c48]/20 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#3f4f24]">
              Enter Your Email
            </DialogTitle>
            <DialogDescription className="text-[#324c48] mt-2">
              Please provide your email address to join our exclusive VIP buyers list.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 text-[#3f4f24] border border-[#324c48] rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-[#324c48] text-[#324c48]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDialogSubmit}
              className="bg-[#324c48] text-white hover:bg-[#3f4f24]"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GetStarted;