import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      
      // Reset the subscribed message after a few seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-[#EFE8DE] pt-12 pb-6 text-[#3f4f24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* First Column - About */}
          <div className="space-y-4">
            <img
              src="https://shinyhomes.net/wp-content/uploads/2025/02/Landivo.svg"
              alt="Landivo Logo"
              className="h-12 mb-4"
            />
            <p className="text-[#324c48] text-sm leading-relaxed">
              At Landivo, our mission is to put land ownership within everyone's reach.
              We offer flexible seller financing on most of our off-market
              properties, letting you skip the usual bank hurdles.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-[#3f4f24] hover:text-[#D4A017] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#3f4f24] hover:text-[#D4A017] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#3f4f24] hover:text-[#D4A017] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#3f4f24] hover:text-[#D4A017] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Second Column - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3f4f24] relative">
              <span className="inline-block pb-1 relative">
                Quick Links
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-[#D4A017]"></span>
              </span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/financing" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  Financing
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  Sell Your Land
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Third Column - Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3f4f24] relative">
              <span className="inline-block pb-1 relative">
                Contact Us
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-[#D4A017]"></span>
              </span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-[#D4A017]" />
                <span className="text-[#324c48]">
                  123 Main Street, Suite 200<br />
                  Houston, TX 77001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-[#D4A017]" />
                <a href="tel:+18172471312" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  (817) 247-1312
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-[#D4A017]" />
                <a href="mailto:info@landivo.com" className="text-[#324c48] hover:text-[#D4A017] transition-colors">
                  info@landivo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Fourth Column - Subscribe */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3f4f24] relative">
              <span className="inline-block pb-1 relative">
                Property Alerts
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-[#D4A017]"></span>
              </span>
            </h3>
            <p className="text-[#324c48] text-sm">
              Subscribe to receive alerts about new properties and special offers.
            </p>
            
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-4">
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#324c48] focus:border-[#D4A017] focus:ring-[#D4A017]"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-[#324c48] hover:bg-[#3f4f24] text-white"
                  >
                    Subscribe
                  </Button>
                  
                  {subscribed && (
                    <p className="text-green-600 text-xs mt-1">
                      Thank you for subscribing!
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="bg-[#324c48]/20 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-sm text-[#324c48] mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Landivo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-[#324c48] hover:text-[#D4A017] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-[#324c48] hover:text-[#D4A017] transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-sm text-[#324c48] hover:text-[#D4A017] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;