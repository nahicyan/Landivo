import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "../../utils/format";
const serverURL = import.meta.env.VITE_SERVER_URL;

export default function SlickPropertyCard({ card }) {
  const navigate = useNavigate();

  // If card.imageUrls is already an array, use it; otherwise try to parse it
  const images = card.imageUrls
    ? Array.isArray(card.imageUrls)
      ? card.imageUrls
      : JSON.parse(card.imageUrls)
    : [];
  const firstImage =
    images.length > 0 ? `${serverURL}/${images[0]}` : "/default-image.jpg";

  return (
    <Card
      onClick={() => navigate(`../properties/${card.id}`)}
      className="
        w-[350px]
        rounded-2xl
        overflow-hidden
        shadow-lg
        hover:shadow-2xl
        transition-all
        cursor-pointer
        bg-white
        backdrop-blur-lg
        border border-gray-200
      "
    >
      {/* Top Image Section */}
      <div className="relative">
        <img
          src={firstImage}
          alt="Property"
          className="w-full h-56 object-cover rounded-t-2xl"
        />

        {/* Left Tag */}
        {card.ltag && (
          <span className="absolute top-3 left-3 bg-[#d03c0b] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {card.ltag}
          </span>
        )}

        {/* Right Tag */}
        {card.rtag && (
          <span className="absolute top-3 right-3 bg-[#3c5d58] text-white text-xs px-3 py-1 rounded-full shadow-md">
            {card.rtag}
          </span>
        )}
      </div>

      {/* Content Section (Modified Layout) */}
      <CardContent className="py-2 px-3 flex">
        {/* Left Section (2/3 of the card) */}
        <div className="w-full basis-[73%]">
          {/* Acre and Address */}
          <div className="flex flex-col">
            <span className="text-gray-600 text-base font-normal mb-1">
              {card.acre} Acres
            </span>
            <p className="text-base font-semibold text-gray-800 mb-1">
              {card.streetAddress || "123 Main St Apt #1"}
            </p>
            <p className="text-xs text-gray-500">
              {card.city}, {card.state} {card.zip}
            </p>
          </div>
        </div>

        {/* Right Section (1/3 of the card) */}
        <div className="w-full basis-[27%] flex flex-col items-end justify-start">
          {/* Price */}
          <span className="text-[#517b75] text-lg font-semibold tracking-tight">
            ${formatPrice(card.askingPrice)}
          </span>
          {card.financing === "Available" && (
            <>
              {/* <span className="mt-1 text-[#D4A017] text-sm font-medium">
                Starts At
              </span> */}
              <span className="mt-1 text-[#D4A017] text-base font-medium tracking-tighter">
                $
                {formatPrice(
                  Math.min(
                    card.monthlyPaymentOne,
                    card.monthlyPaymentTwo,
                    card.monthlyPaymentThree
                  )
                )}
                /mo
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
