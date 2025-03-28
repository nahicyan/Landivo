import { useQuery } from "react-query";
import { getBuyerById } from "@/utils/api";

/**
 * Hook to fetch a specific buyer by ID
 * @param {string} buyerId - ID of the buyer
 * @returns {Object} - Query result with buyer data
 */
const useBuyer = (buyerId) => {
  return useQuery(
    ["buyer", buyerId],
    () => getBuyerById(buyerId),
    {
      enabled: !!buyerId, // Only run the query if buyerId is provided
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    }
  );
};

export default useBuyer;