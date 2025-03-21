"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserInfo({ surveyData, updateSurveyData, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    first_name: surveyData.first_name || "",
    last_name: surveyData.last_name || "",
    email: surveyData.email || "",
    phone: surveyData.phone || ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update parent state with form values
    Object.keys(formData).forEach(key => {
      updateSurveyData(key, formData[key]);
    });
    
    // Call the onSubmit function passed from parent
    onSubmit();
  };

  // Translation object based on selected language
  const translations = {
    en: {
      title: "Give us a way to reach you",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      submit: "Submit Application",
      back: "Back"
    },
    es: {
      title: "Díganos cómo podemos comunicarnos con usted",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      phone: "Número de teléfono",
      submit: "Enviar solicitud",
      back: "Atrás"
    }
  };

  // Get translations based on selected language
  const t = translations[surveyData.language || "en"];

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#324c48] mb-6">
            {t.title}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="first_name" className="text-[#324c48]">{t.firstName}</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                  required
                />
              </div>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="last_name" className="text-[#324c48]">{t.lastName}</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-[#324c48]">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                required
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="phone" className="text-[#324c48]">{t.phone}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="border-[#c1d7d3] focus:border-[#324c48] focus:ring-[#324c48]"
                required
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                className="text-[#324c48] border-[#324c48] hover:bg-[#f0f5f4]"
                onClick={onBack}
              >
                {t.back}
              </Button>
              
              <Button
                type="submit"
                className="bg-[#D4A017] hover:bg-[#b88914] text-white"
              >
                {t.submit}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}