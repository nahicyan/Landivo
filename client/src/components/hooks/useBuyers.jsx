import { useQuery } from "react-query";
import { getAllBuyers } from "@/utils/api";

/**
 * Hook to fetch all buyers
 * @returns {Object} - Query result with buyers data
 */
const useBuyers = () => {
  return useQuery(["buyers"], getAllBuyers, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export default useBuyers;