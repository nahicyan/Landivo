// hooks/useBuyerLists.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  getBuyerLists, 
  getBuyerList,
  createBuyerList, 
  updateBuyerList, 
  deleteBuyerList, 
  addBuyersToList, 
  removeBuyersFromList, 
  sendEmailToList 
} from "@/utils/api";

export function useBuyerLists() {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
  });

  // Fetch all buyer lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const data = await getBuyerLists();
        setLists(data);
        setFilteredLists(data);
      } catch (err) {
        console.error("Error fetching buyer lists:", err);
        setError("Failed to load buyer lists");
        toast.error("Failed to load buyer lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Apply filters when filters or lists change
  useEffect(() => {
    if (!lists.length) return;

    let result = [...lists];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(list => 
        list.name.toLowerCase().includes(searchTerm) ||
        (list.description && list.description.toLowerCase().includes(searchTerm)) ||
        (list.criteria?.areas && list.criteria.areas.some(area => 
          area.toLowerCase().includes(searchTerm)
        )) ||
        (list.criteria?.buyerTypes && list.criteria.buyerTypes.some(type => 
          type.toLowerCase().includes(searchTerm)
        ))
      );
    }

    setFilteredLists(result);
  }, [lists, filters]);

  // Create a new list
  const createList = async (listData) => {
    try {
      const response = await createBuyerList(listData);
      setLists(prev => [...prev, response.list]);
      toast.success("Buyer list created successfully!");
      return response.list;
    } catch (err) {
      console.error("Error creating buyer list:", err);
      toast.error("Failed to create buyer list");
      throw err;
    }
  };

  // Update an existing list
  const updateList = async (listId, listData) => {
    try {
      const response = await updateBuyerList(listId, listData);
      setLists(prev => 
        prev.map(list => list.id === listId ? response.list : list)
      );
      toast.success("Buyer list updated successfully!");
      return response.list;
    } catch (err) {
      console.error("Error updating buyer list:", err);
      toast.error("Failed to update buyer list");
      throw err;
    }
  };

  // Delete a list
  const deleteList = async (listId) => {
    try {
      await deleteBuyerList(listId);
      setLists(prev => prev.filter(list => list.id !== listId));
      toast.success("Buyer list deleted successfully!");
    } catch (err) {
      console.error("Error deleting buyer list:", err);
      toast.error("Failed to delete buyer list");
      throw err;
    }
  };

  // Add buyers to a list
  const addBuyersToList = async (listId, buyerIds) => {
    try {
      await addBuyersToList(listId, buyerIds);
      
      // Update the buyer count in the list
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              buyerCount: list.buyerCount + buyerIds.length 
            };
          }
          return list;
        })
      );
      
      toast.success(`${buyerIds.length} buyers added to list!`);
    } catch (err) {
      console.error("Error adding buyers to list:", err);
      toast.error("Failed to add buyers to list");
      throw err;
    }
  };

  // Remove buyers from a list
  const removeBuyersFromList = async (listId, buyerIds) => {
    try {
      await removeBuyersFromList(listId, buyerIds);
      
      // Update the buyer count in the list
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              buyerCount: Math.max(0, list.buyerCount - buyerIds.length)
            };
          }
          return list;
        })
      );
      
      toast.success(`${buyerIds.length} buyers removed from list!`);
    } catch (err) {
      console.error("Error removing buyers from list:", err);
      toast.error("Failed to remove buyers from list");
      throw err;
    }
  };

  // Send email to list
  const sendEmail = async (listId, emailData) => {
    try {
      await sendEmailToList(listId, emailData);
      
      // Update the last email date
      setLists(prev => 
        prev.map(list => {
          if (list.id === listId) {
            return { 
              ...list, 
              lastEmailDate: new Date().toISOString() 
            };
          }
          return list;
        })
      );
      
      toast.success("Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send email");
      throw err;
    }
  };

  // Get list members
  const getListMembers = async (listId) => {
    try {
      const listData = await getBuyerList(listId);
      return listData.buyers || [];
    } catch (err) {
      console.error("Error fetching list members:", err);
      toast.error("Failed to fetch list members");
      throw err;
    }
  };

  return {
    lists,
    filteredLists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    addBuyersToList,
    removeBuyersFromList,
    sendEmail,
    getListMembers,
    setListFilters: setFilters
  };
}

// hooks/useBuyers.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllBuyers } from "@/utils/api";

export function useBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [availableBuyers, setAvailableBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all buyers
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const data = await getAllBuyers();
        setBuyers(data);
        setAvailableBuyers(data);
      } catch (err) {
        console.error("Error fetching buyers:", err);
        setError("Failed to load buyers");
        toast.error("Failed to load buyers");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Filter available buyers
  const filterAvailableBuyers = (filters = {}) => {
    let filtered = [...buyers];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(buyer => 
        buyer.firstName.toLowerCase().includes(searchTerm) ||
        buyer.lastName.toLowerCase().includes(searchTerm) ||
        buyer.email.toLowerCase().includes(searchTerm) ||
        buyer.phone.includes(searchTerm)
      );
    }
    
    // Apply type filter
    if (filters.buyerType && filters.buyerType !== "all") {
      filtered = filtered.filter(buyer => buyer.buyerType === filters.buyerType);
    }
    
    setAvailableBuyers(filtered);
  };

  // Get buyers from a specific list
  const getBuyersNotInList = (listBuyerIds) => {
    return buyers.filter(buyer => !listBuyerIds.includes(buyer.id));
  };

  return {
    buyers,
    availableBuyers,
    loading,
    error,
    filterAvailableBuyers,
    getBuyersNotInList
  };
}

// hooks/useCsvImport.js
import { useState } from "react";
import Papa from "papaparse";

export function useCsvImport() {
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    defaultBuyerType: "Investor",
    defaultArea: "DFW"
  });

  // Parse CSV file
  const parseCsvFile = (file) => {
    if (!file) return;
    
    setCsvFile(file);
    setCsvData([]);
    setCsvErrors([]);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors = [];
        
        // Validate CSV format
        const requiredColumns = ["firstName", "lastName", "email", "phone"];
        const headers = results.meta.fields || [];
        
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
        }
        
        // Validate data
        const validData = results.data.filter((row, index) => {
          const rowErrors = [];
          
          // Check required fields
          if (!row.firstName) rowErrors.push("Missing first name");
          if (!row.lastName) rowErrors.push("Missing last name");
          if (!row.email) rowErrors.push("Missing email");
          if (!row.phone) rowErrors.push("Missing phone");
          
          // Add any row errors to the main errors array
          if (rowErrors.length > 0) {
            errors.push(`Row ${index + 2}: ${rowErrors.join(", ")}`);
            return false;
          }
          
          return true;
        });
        
        // Update state
        setCsvData(validData);
        setCsvErrors(errors);
      },
      error: (error) => {
        setCsvErrors([`Error parsing CSV: ${error.message}`]);
      }
    });
  };

  // Format CSV data to buyer objects
  const formatCsvDataToBuyers = () => {
    return csvData.map((row, index) => ({
      id: `csv-buyer-${Date.now()}-${index}`,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      buyerType: row.buyerType || importOptions.defaultBuyerType,
      preferredAreas: row.preferredAreas ? 
        row.preferredAreas.split(",").map(a => a.trim()) : 
        [importOptions.defaultArea],
      source: "CSV Import"
    }));
  };

  // Reset CSV state
  const resetCsvState = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
  };

  return {
    csvFile,
    csvData,
    csvErrors,
    importOptions,
    parseCsvFile,
    formatCsvDataToBuyers,
    resetCsvState,
    setImportOptions
  };
}