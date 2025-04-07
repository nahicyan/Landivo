import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlickPropertyCard from "../../components/SlickPropertyCard"; // Import your SlickPropertyCard component
import { useLocation } from "react-router-dom"; // Import useLocation to get current path

const NearbySimilarProperties = ({ 
  currentProperty,
  allProperties
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  const location = useLocation(); // Get current location to determine URL structure
  
  // Filter and sort properties to find similar ones
  const similarProperties = allProperties
    .filter(property => {
      // Skip the current property
      if (property.id === currentProperty.id) return false;
      
      // Area match
      const areaMatch = property.area === currentProperty.area;
      
      // Only consider properties that match by area
      return areaMatch;
    })
    .sort((a, b) => {
      // Prioritize zoning match
      const aZoningMatch = a.zoning === currentProperty.zoning ? 1 : 0;
      const bZoningMatch = b.zoning === currentProperty.zoning ? 1 : 0;
      
      // Sort by zoning match (properties with matching zoning come first)
      return bZoningMatch - aZoningMatch;
    })
    .slice(0, 10); // Limit to 10 properties
  
  // Calculate if we can scroll left/right
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth 
    : false;
  
  // Handle scroll events
  const handleScrollLeft = () => {
    if (containerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 380);
      containerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };
  
  const handleScrollRight = () => {
    if (containerRef.current) {
      const newPosition = scrollPosition + 380;
      containerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };
  
  // Update scroll position when scrolling manually
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };
  
  // Check scroll status on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Force recalculation of scroll ability
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If no similar properties, don't render
  if (!similarProperties.length) return null;

  // Create modified property objects with path corrections for the SlickPropertyCard
  const preparedProperties = similarProperties.map(property => {
    // Create a shallow copy of the property
    const modifiedProperty = { ...property };
    
    // Add an additional property that will be used by a wrapper
    modifiedProperty._fixedId = property.id;
    
    return modifiedProperty;
  });

  return (
    <div className="w-full bg-[#FDF8F2] py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#324c48]">
          Nearby Similar Properties
        </h2>
        
        <div className="relative">
          {/* Left Button: Only show on desktop and if there's content to scroll left */}
          {canScrollLeft && (
            <Button
              variant="outline"
              className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              onClick={handleScrollLeft}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {/* Scrollable container (Horizontal on Desktop, Column on Mobile) */}
          <div
            ref={containerRef}
            className="px-2 py-4 overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden no-scrollbar"
            onScroll={handleScroll}
          >
            <div className="flex flex-col items-start space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-20">
              {preparedProperties.map((card) => (
                <div
                  key={card.id}
                  className="w-72 flex-shrink-0 transition hover:scale-105"
                  // Since we can't modify SlickPropertyCard, we wrap it in a fix
                  onClick={(e) => {
                    // Stop the original click from propagating - this is crucial
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Navigate directly to the correct absolute URL
                    window.location.href = `/properties/${card._fixedId}`;
                  }}
                >
                  <SlickPropertyCard card={card} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Button: Only show on desktop and if there's content to scroll right */}
          {canScrollRight && (
            <Button
              variant="outline"
              className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg"
              onClick={handleScrollRight}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbySimilarProperties;