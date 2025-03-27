import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check } from 'lucide-react';
// Import from heroicons instead of lucide-react for consistency
import { EnvelopeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Subscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ success: false, message: '', type: '' });
  
  // Get email from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email, redirect back to homepage
      navigate('/');
    }
  }, [location, navigate]);

  const handleOptionSelect = async (type) => {
    try {
      // In a real app, you would make an actual API call here
      // This is a simulation for demonstration purposes
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true }), 1000)
      );
      
      if (response.success) {
        setStatus({
          success: true,
          message: type === 'buyersList' 
            ? 'You have been added to our exclusive buyers list!' 
            : 'You have been subscribed to our property alerts!',
          type: type
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'There was an error processing your request. Please try again.',
        type: ''
      });
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3f4f24] mb-4">Choose Your Subscription Type</h1>
          <p className="text-xl text-[#324c48]">Thank you for your interest in Landivo, <span className="font-semibold">{email}</span></p>
          
          {status.success && (
            <Alert className="mt-6 max-w-xl mx-auto bg-green-100 border-green-300 text-green-800">
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Exclusive Buyers List Card */}
          <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${status.type === 'buyersList' ? 'border-[#3f4f24] bg-[#e8efdc]' : 'hover:border-[#D4A017]'}`}>
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto bg-[#3f4f24]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <UserGroupIcon className="h-8 w-8 text-[#3f4f24]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#3f4f24]">Exclusive Buyers List</CardTitle>
              <CardDescription className="text-[#324c48] text-base mt-2">
                Join our VIP list for the best deals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Get early access to new properties</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Receive exclusive discounts not available to the public</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Be first to know about new financing options</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Personalized property recommendations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleOptionSelect('buyersList')}
                className={`w-full ${status.type === 'buyersList' 
                  ? 'bg-[#3f4f24] hover:bg-[#3f4f24]' 
                  : 'bg-[#324c48] hover:bg-[#3f4f24]'} text-white py-6 text-lg`}
                disabled={status.success}
              >
                {status.type === 'buyersList' ? 'Successfully Joined ✓' : 'Join Exclusive Buyers List'}
              </Button>
            </CardFooter>
          </Card>

          {/* Property Alerts Card */}
          <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${status.type === 'propertyAlerts' ? 'border-[#3f4f24] bg-[#e8efdc]' : 'hover:border-[#D4A017]'}`}>
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto bg-[#3f4f24]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-[#3f4f24]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#3f4f24]">Property Alerts</CardTitle>
              <CardDescription className="text-[#324c48] text-base mt-2">
                Stay updated on new properties
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Regular updates on new properties</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Notifications for properties in your preferred areas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Market trends and real estate news</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Easy unsubscribe anytime</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleOptionSelect('propertyAlerts')}
                className={`w-full ${status.type === 'propertyAlerts' 
                  ? 'bg-[#3f4f24] hover:bg-[#3f4f24]' 
                  : 'bg-[#324c48] hover:bg-[#3f4f24]'} text-white py-6 text-lg`}
                disabled={status.success}
              >
                {status.type === 'propertyAlerts' ? 'Successfully Subscribed ✓' : 'Subscribe to Property Alerts'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {status.success && (
          <div className="text-center mt-10">
            <p className="text-lg text-[#324c48] mb-4">
              Thank you for subscribing! You'll receive updates soon.
            </p>
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-[#324c48] text-[#324c48] hover:bg-[#324c48] hover:text-white"
            >
              Return to Homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}