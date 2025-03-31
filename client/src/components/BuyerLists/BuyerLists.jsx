import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import Papa from "papaparse";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Mail, 
  PlusCircle, 
  Trash2, 
  Send, 
  Edit, 
  Users,
  UserPlus,
  ListFilter,
  FileUp,
  Download,
  UploadCloud,
  AlertCircle,
  Check,
  FileText,
  RefreshCw
} from "lucide-react";

// Import API functions
import { 
  getBuyerLists,
  getBuyerList,
  createBuyerList,
  updateBuyerList,
  deleteBuyerList,
  addBuyersToList,
  removeBuyersFromList,
  sendEmailToList,
  getAllBuyers
} from "@/utils/api";

// Define the available areas
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth' },
  { id: 'Austin', label: 'Austin' },
  { id: 'Houston', label: 'Houston' },
  { id: 'San Antonio', label: 'San Antonio' },
  { id: 'Other Areas', label: 'Other Areas' }
];

// Define buyer types
const BUYER_TYPES = [
  { id: 'CashBuyer', label: 'Cash Buyer' },
  { id: 'Builder', label: 'Builder' },
  { id: 'Developer', label: 'Developer' },
  { id: 'Realtor', label: 'Realtor' },
  { id: 'Investor', label: 'Investor' },
  { id: 'Wholesaler', label: 'Wholesaler' }
];

export default function BuyerLists() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLists, setFilteredLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [addBuyersOpen, setAddBuyersOpen] = useState(false);
  const [manageBuyersOpen, setManageBuyersOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    content: ""
  });
  
  // Form data for creating or editing a list
  const [listFormData, setListFormData] = useState({
    name: "",
    description: "",
    criteria: {
      areas: [],
      buyerTypes: [],
      isVIP: false
    }
  });
  
  // CSV import state
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    defaultBuyerType: "Investor",
    defaultArea: "DFW"
  });
  
  // Available buyers state (for adding to list)
  const [availableBuyers, setAvailableBuyers] = useState([]);
  const [buyerSearchQuery, setBuyerSearchQuery] = useState("");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  
  // List members state (for managing existing members)
  const [listMembers, setListMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch buyer lists and buyers from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all buyer lists
        const listsData = await getBuyerLists();
        setLists(listsData);
        setFilteredLists(listsData);
        
        // Fetch all buyers
        const buyersData = await getAllBuyers();
        setBuyers(buyersData);
        setAvailableBuyers(buyersData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load buyer lists");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update filtered lists when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLists(lists);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = lists.filter(list => 
      list.name.toLowerCase().includes(query) ||
      list.description?.toLowerCase().includes(query) ||
      (list.criteria?.areas && list.criteria.areas.some(area => area.toLowerCase().includes(query))) ||
      (list.criteria?.buyerTypes && list.criteria.buyerTypes.some(type => type.toLowerCase().includes(query)))
    );
    
    setFilteredLists(filtered);
  }, [lists, searchQuery]);

  // Set list form data when editing a list
  useEffect(() => {
    if (selectedList) {
      const list = lists.find(l => l.id === selectedList);
      if (list) {
        setListFormData({
          name: list.name,
          description: list.description || "",
          criteria: { 
            areas: list.criteria?.areas || [],
            buyerTypes: list.criteria?.buyerTypes || [],
            isVIP: list.criteria?.isVIP || false
          }
        });
      }
    }
  }, [selectedList, lists]);
  
  // Filter available buyers when searching/filtering
  useEffect(() => {
    if (!addBuyersOpen) return;
    
    let filtered = [...availableBuyers];
    
    // Apply search query filter
    if (buyerSearchQuery.trim()) {
      const query = buyerSearchQuery.toLowerCase();
      filtered = filtered.filter(buyer => 
        buyer.firstName.toLowerCase().includes(query) ||
        buyer.lastName.toLowerCase().includes(query) ||
        buyer.email.toLowerCase().includes(query) ||
        buyer.phone.includes(query)
      );
    }
    
    // Apply buyer type filter
    if (buyerTypeFilter !== "all") {
      filtered = filtered.filter(buyer => buyer.buyerType === buyerTypeFilter);
    }
    
    setFilteredBuyers(filtered);
  }, [addBuyersOpen, availableBuyers, buyerSearchQuery, buyerTypeFilter]);
  
  // Filter list members when searching
  useEffect(() => {
    if (!manageBuyersOpen) return;
    
    let filtered = [...listMembers];
    
    // Apply search query filter
    if (memberSearchQuery.trim()) {
      const query = memberSearchQuery.toLowerCase();
      filtered = filtered.filter(buyer => 
        buyer.firstName.toLowerCase().includes(query) ||
        buyer.lastName.toLowerCase().includes(query) ||
        buyer.email.toLowerCase().includes(query) ||
        buyer.phone.includes(query)
      );
    }
    
    setFilteredMembers(filtered);
  }, [manageBuyersOpen, listMembers, memberSearchQuery]);

  // Handle creating a new list
  const handleCreateList = async () => {
    // Validate form
    if (!listFormData.name.trim()) {
      toast.error("List name is required");
      return;
    }
    
    try {
      // Create the new list via API
      const newList = await createBuyerList({
        name: listFormData.name,
        description: listFormData.description,
        criteria: listFormData.criteria,
      });
      
      // Add to lists
      setLists(prev => [...prev, newList.list]);
      
      // Reset form and close dialog
      setListFormData({
        name: "",
        description: "",
        criteria: {
          areas: [],
          buyerTypes: [],
          isVIP: false
        }
      });
      
      setCreateListOpen(false);
      toast.success("Buyer list created successfully!");
      
      // Process CSV data if available
      if (csvData.length > 0) {
        handleAddCsvBuyersToList(newList.list.id);
      }
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error("Failed to create buyer list");
    }
  };
  
  // Handle updating an existing list
  const handleUpdateList = async () => {
    // Validate form
    if (!listFormData.name.trim()) {
      toast.error("List name is required");
      return;
    }
    
    try {
      // Update the list via API
      const updatedList = await updateBuyerList(selectedList, {
        name: listFormData.name,
        description: listFormData.description,
        criteria: listFormData.criteria
      });
      
      // Update lists state
      setLists(prev => 
        prev.map(list => 
          list.id === selectedList 
            ? updatedList.list
            : list
        )
      );
      
      // Reset form and close dialog
      setEditListOpen(false);
      toast.success("Buyer list updated successfully!");
      
      // Process CSV data if available
      if (csvData.length > 0) {
        handleAddCsvBuyersToList(selectedList);
      }
    } catch (error) {
      console.error("Error updating list:", error);
      toast.error("Failed to update buyer list");
    }
  };
  
  // Handle deleting a list
  const handleDeleteList = async (listId) => {
    try {
      // Delete the list via API
      await deleteBuyerList(listId);
      
      // Remove the list from state
      setLists(prev => prev.filter(list => list.id !== listId));
      toast.success("Buyer list deleted successfully!");
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error("Failed to delete buyer list");
    }
  };
  
  // Handle sending email to a list
  const handleSendEmail = async () => {
    // Validate email data
    if (!emailData.subject.trim() || !emailData.content.trim()) {
      toast.error("Email subject and content are required");
      return;
    }
    
    try {
      // Send email via API
      await sendEmailToList(selectedList, {
        subject: emailData.subject,
        content: emailData.content,
        includeUnsubscribed: false
      });
      
      // Update last email date for the list
      setLists(prev => 
        prev.map(l => 
          l.id === selectedList 
            ? { ...l, lastEmailDate: new Date().toISOString() } 
            : l
        )
      );
      
      // Reset form and close dialog
      setEmailData({ subject: "", content: "" });
      setEmailDialogOpen(false);
      
      const list = lists.find(l => l.id === selectedList);
      toast.success(`Email sent to ${list.name} list (${list.buyerCount} buyers)!`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email to list");
    }
  };
  
  // Handle selecting/deselecting a buyer
  const handleSelectBuyer = (buyerId) => {
    setSelectedBuyers(prev => {
      if (prev.includes(buyerId)) {
        return prev.filter(id => id !== buyerId);
      } else {
        return [...prev, buyerId];
      }
    });
  };
  
  // Handle selecting/deselecting a list member
  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  // Handle adding selected buyers to the list
  const handleAddBuyersToList = async () => {
    if (selectedBuyers.length === 0) {
      toast.error("No buyers selected");
      return;
    }
    
    try {
      // Add buyers to list via API
      await addBuyersToList(selectedList, selectedBuyers);
      
      // Find the selected list
      const list = lists.find(l => l.id === selectedList);
      if (!list) return;
      
      // Update buyer count
      setLists(prev => 
        prev.map(l => 
          l.id === selectedList 
            ? { ...l, buyerCount: l.buyerCount + selectedBuyers.length } 
            : l
        )
      );
      
      // Show success message
      toast.success(`${selectedBuyers.length} buyers added to ${list.name} list!`);
      
      // Reset selected buyers and close dialog
      setSelectedBuyers([]);
      setAddBuyersOpen(false);
    } catch (error) {
      console.error("Error adding buyers to list:", error);
      toast.error("Failed to add buyers to list");
    }
  };
  
  // Handle removing selected members from the list
  const handleRemoveMembersFromList = async () => {
    if (selectedMembers.length === 0) {
      toast.error("No members selected");
      return;
    }
    
    try {
      // Remove members from list via API
      await removeBuyersFromList(selectedList, selectedMembers);
      
      // Find the selected list
      const list = lists.find(l => l.id === selectedList);
      if (!list) return;
      
      // Update buyer count
      setLists(prev => 
        prev.map(l => 
          l.id === selectedList 
            ? { ...l, buyerCount: Math.max(0, l.buyerCount - selectedMembers.length) } 
            : l
        )
      );
      
      // Remove members from list
      setListMembers(prev => 
        prev.filter(member => !selectedMembers.includes(member.id))
      );
      
      // Show success message
      toast.success(`${selectedMembers.length} buyers removed from ${list.name} list!`);
      
      // Reset selected members
      setSelectedMembers([]);
      
      // Update filtered members
      setFilteredMembers(prev => 
        prev.filter(member => !selectedMembers.includes(member.id))
      );
    } catch (error) {
      console.error("Error removing members from list:", error);
      toast.error("Failed to remove members from list");
    }
  };
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setListFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle criteria changes
  const handleCriteriaChange = (field, value) => {
    setListFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: value
      }
    }));
  };
  
  // Handle email form changes
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset the form when creating a new list
  const handleNewList = () => {
    setListFormData({
      name: "",
      description: "",
      criteria: {
        areas: [],
        buyerTypes: [],
        isVIP: false
      }
    });
    
    // Clear any previous CSV data
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    
    setCreateListOpen(true);
  };
  
  // Open edit dialog for a list
  const handleEditList = (listId) => {
    setSelectedList(listId);
    
    // Clear any previous CSV data
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    
    setEditListOpen(true);
  };
  
  // Open email dialog for a list
  const handleEmailList = (listId) => {
    setSelectedList(listId);
    setEmailDialogOpen(true);
  };
  
  // Open add buyers dialog for a list
  const handleAddBuyers = (listId) => {
    setSelectedList(listId);
    setSelectedBuyers([]);
    setBuyerSearchQuery("");
    setBuyerTypeFilter("all");
    setAddBuyersOpen(true);
  };
  
  // Open manage members dialog for a list
  const handleManageMembers = async (listId) => {
    setSelectedList(listId);
    setSelectedMembers([]);
    setMemberSearchQuery("");
    
    try {
      // Fetch the list with its members from the API
      const listData = await getBuyerList(listId);
      
      if (listData && listData.buyers) {
        setListMembers(listData.buyers);
        setFilteredMembers(listData.buyers);
      } else {
        setListMembers([]);
        setFilteredMembers([]);
      }
      
      setManageBuyersOpen(true);
    } catch (error) {
      console.error("Error fetching list members:", error);
      toast.error("Failed to load list members");
    }
  };
  
  // Handle CSV file selection
  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCsvFile(file);
    setCsvData([]);
    setCsvErrors([]);
    
    // Parse CSV file
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
  
  // Add CSV buyers to list
  const handleAddCsvBuyersToList = async (listId) => {
    if (csvData.length === 0) return;
    
    try {
      // Convert CSV data to buyer objects
      const newBuyers = csvData.map((row, index) => ({
        id: `csv-buyer-${Date.now()}-${index}`,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        buyerType: row.buyerType || importOptions.defaultBuyerType,
        preferredAreas: row.preferredAreas ? row.preferredAreas.split(",").map(a => a.trim()) : [importOptions.defaultArea],
        source: "CSV Import"
      }));
      
      // Create buyers and add them to the list
      // In a real implementation, you'd have an API endpoint for batch creating buyers
      // For now, we'll simulate by adding the buyers to our local state
      setBuyers(prev => [...prev, ...newBuyers]);
      setAvailableBuyers(prev => [...prev, ...newBuyers]);
      
      // After creating buyers, add them to the list
      const buyerIds = newBuyers.map(buyer => buyer.id);
      await addBuyersToList(listId, buyerIds);
      
      // Update list buyer count
      setLists(prev => 
        prev.map(l => 
          l.id === listId 
            ? { ...l, buyerCount: l.buyerCount + newBuyers.length } 
            : l
        )
      );
      
      // Show success message
      toast.success(`${newBuyers.length} buyers imported and added to list!`);
      
      // Reset CSV data
      setCsvFile(null);
      setCsvData([]);
      setCsvErrors([]);
      setCsvUploadOpen(false);
    } catch (error) {
      console.error("Error importing buyers:", error);
      toast.error("Failed to import buyers");
    }
  };
  
  // Open CSV upload dialog for creating/editing a list
  const handleOpenCsvUpload = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    setCsvUploadOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#324c48] mb-2">Buyer Lists</h1>
        <p className="text-gray-600">
          Create and manage lists of buyers grouped by area and type for targeted emails
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-[#324c48]/20">
        <CardHeader className="bg-[#f0f5f4] border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Buyer Lists</CardTitle>
            
            <div className="flex gap-2">
              <Button
                className="bg-[#324c48] text-white"
                onClick={handleNewList}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New List
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative max-w-sm mx-auto sm:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-[#324c48]/30"
              />
            </div>
          </div>
          
          {/* Lists Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>List Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="text-center">Buyers</TableHead>
                  <TableHead>Last Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLists.length > 0 ? (
                  filteredLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">
                        {list.name}
                      </TableCell>
                      <TableCell>
                        {list.description}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {list.criteria && list.criteria.areas && list.criteria.areas.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {list.criteria.areas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {list.criteria && list.criteria.buyerTypes && list.criteria.buyerTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {list.criteria.buyerTypes.map((type, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className={`
                                    text-xs
                                    ${type === 'CashBuyer' ? 'bg-green-100 text-green-800' : ''}
                                    ${type === 'Investor' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${type === 'Realtor' ? 'bg-purple-100 text-purple-800' : ''}
                                    ${type === 'Builder' ? 'bg-orange-100 text-orange-800' : ''}
                                    ${type === 'Developer' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${type === 'Wholesaler' ? 'bg-indigo-100 text-indigo-800' : ''}
                                  `}
                                >
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {list.criteria && list.criteria.isVIP && (
                            <Badge className="bg-[#D4A017] text-white text-xs">VIP Only</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xl font-semibold">{list.buyerCount}</span>
                      </TableCell>
                      <TableCell>
                        {list.lastEmailDate ? (
                          <span className="text-sm">
                            {new Date(list.lastEmailDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Never</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#324c48]"
                            onClick={() => handleEmailList(list.id)}
                          >
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#324c48]"
                            onClick={() => handleAddBuyers(list.id)}
                          >
                            <UserPlus className="h-4 w-4" />
                            <span className="sr-only">Add Buyers</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#324c48]"
                            onClick={() => handleManageMembers(list.id)}
                          >
                            <Users className="h-4 w-4" />
                            <span className="sr-only">Manage Members</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#324c48]"
                            onClick={() => handleEditList(list.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDeleteList(list.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchQuery ? "No lists match your search." : "No buyer lists found. Create your first list!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create New List Dialog */}
      <Dialog open={createListOpen} onOpenChange={setCreateListOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Buyer List</DialogTitle>
            <DialogDescription>
              Define a new list of buyers based on area and type criteria
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">List Details</TabsTrigger>
              <TabsTrigger value="import">Import Buyers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">List Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={listFormData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Austin Builders"
                    className="border-[#324c48]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={listFormData.description}
                    onChange={handleFormChange}
                    placeholder="What is this list for?"
                    className="border-[#324c48]/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Area Criteria</Label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map(area => (
                      <Badge
                        key={area.id}
                        variant={listFormData.criteria.areas.includes(area.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          listFormData.criteria.areas.includes(area.id) 
                            ? "bg-[#324c48]" 
                            : "hover:bg-[#324c48]/10"
                        }`}
                        onClick={() => {
                          const updatedAreas = listFormData.criteria.areas.includes(area.id)
                            ? listFormData.criteria.areas.filter(a => a !== area.id)
                            : [...listFormData.criteria.areas, area.id];
                          handleCriteriaChange("areas", updatedAreas);
                        }}
                      >
                        {area.label}
                      </Badge>
                    ))}
                  </div>
                  {listFormData.criteria.areas.length === 0 && (
                    <p className="text-sm text-gray-500">No areas selected (will include all areas)</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Buyer Type Criteria</Label>
                  <div className="flex flex-wrap gap-2">
                    {BUYER_TYPES.map(type => (
                      <Badge
                        key={type.id}
                        variant={listFormData.criteria.buyerTypes.includes(type.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          listFormData.criteria.buyerTypes.includes(type.id) 
                            ? "bg-[#324c48]" 
                            : "hover:bg-[#324c48]/10"
                        }`}
                        onClick={() => {
                          const updatedTypes = listFormData.criteria.buyerTypes.includes(type.id)
                            ? listFormData.criteria.buyerTypes.filter(t => t !== type.id)
                            : [...listFormData.criteria.buyerTypes, type.id];
                          handleCriteriaChange("buyerTypes", updatedTypes);
                        }}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                  {listFormData.criteria.buyerTypes.length === 0 && (
                    <p className="text-sm text-gray-500">No types selected (will include all buyer types)</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVip"
                    checked={listFormData.criteria.isVIP}
                    onCheckedChange={(checked) => handleCriteriaChange("isVIP", checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#324c48] focus:ring-[#324c48]"
                  />
                  <Label htmlFor="isVip">VIP Buyers Only</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="py-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="csv-file">Import buyers from CSV</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-[#324c48] text-[#324c48]"
                    onClick={() => document.getElementById('csv-file').click()}
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCsvFileChange}
                  />
                </div>
                
                {csvFile && (
                  <div className="flex items-center gap-2 p-2 bg-[#f0f5f4] rounded-lg">
                    <FileText className="h-5 w-5 text-[#324c48]" />
                    <span className="font-medium">{csvFile.name}</span>
                    <span className="text-sm text-gray-500">
                      ({(csvFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto h-8 w-8 p-0 text-gray-500"
                      onClick={() => {
                        setCsvFile(null);
                        setCsvData([]);
                        setCsvErrors([]);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                )}
                
                {csvErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="font-medium text-red-700">CSV Import Errors</p>
                    </div>
                    <ul className="pl-5 list-disc text-sm text-red-600 space-y-1">
                      {csvErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {csvData.length > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <p className="font-medium text-green-700">
                        {csvData.length} buyers ready to import
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="p-3 bg-[#f0f5f4] rounded-lg">
                  <p className="text-sm font-medium text-[#324c48] mb-2">
                    CSV Format Requirements:
                  </p>
                  <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1">
                    <li>Required columns: firstName, lastName, email, phone</li>
                    <li>Optional columns: buyerType, preferredAreas (comma separated)</li>
                    <li>First row should be column headers</li>
                  </ul>
                  <p className="text-sm mt-2">
                    <a href="#" className="text-[#324c48] underline" onClick={(e) => {
                      e.preventDefault();
                      const csv = "firstName,lastName,email,phone,buyerType,preferredAreas\nJohn,Doe,john@example.com,(555) 123-4567,Builder,\"Austin, DFW\"\nJane,Smith,jane@example.com,(555) 987-6543,Investor,Houston";
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'buyer_list_template.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      Download template
                    </a>
                  </p>
                </div>
                
                <div className="bg-[#f0f5f4]/50 p-3 rounded-lg space-y-3">
                  <p className="text-sm font-medium text-[#324c48]">
                    Default values for missing fields:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="defaultBuyerType" className="text-sm">Default Buyer Type</Label>
                      <Select
                        value={importOptions.defaultBuyerType}
                        onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultBuyerType: value }))}
                      >
                        <SelectTrigger id="defaultBuyerType" className="text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUYER_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="defaultArea" className="text-sm">Default Area</Label>
                      <Select
                        value={importOptions.defaultArea}
                        onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultArea: value }))}
                      >
                        <SelectTrigger id="defaultArea" className="text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AREAS.map(area => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skipFirstRow"
                      checked={importOptions.skipFirstRow}
                      onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, skipFirstRow: checked }))}
                    />
                    <Label htmlFor="skipFirstRow" className="text-sm">Skip first row (header row)</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} className="bg-[#324c48] text-white">
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog open={editListOpen} onOpenChange={setEditListOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Buyer List</DialogTitle>
            <DialogDescription>
              Update the list name, description, and criteria
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">List Details</TabsTrigger>
              <TabsTrigger value="import">Import Buyers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">List Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={listFormData.name}
                    onChange={handleFormChange}
                    className="border-[#324c48]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={listFormData.description}
                    onChange={handleFormChange}
                    className="border-[#324c48]/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Area Criteria</Label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map(area => (
                      <Badge
                        key={area.id}
                        variant={listFormData.criteria.areas.includes(area.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          listFormData.criteria.areas.includes(area.id) 
                            ? "bg-[#324c48]" 
                            : "hover:bg-[#324c48]/10"
                        }`}
                        onClick={() => {
                          const updatedAreas = listFormData.criteria.areas.includes(area.id)
                            ? listFormData.criteria.areas.filter(a => a !== area.id)
                            : [...listFormData.criteria.areas, area.id];
                          handleCriteriaChange("areas", updatedAreas);
                        }}
                      >
                        {area.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Buyer Type Criteria</Label>
                  <div className="flex flex-wrap gap-2">
                    {BUYER_TYPES.map(type => (
                      <Badge
                        key={type.id}
                        variant={listFormData.criteria.buyerTypes.includes(type.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          listFormData.criteria.buyerTypes.includes(type.id) 
                            ? "bg-[#324c48]" 
                            : "hover:bg-[#324c48]/10"
                        }`}
                        onClick={() => {
                          const updatedTypes = listFormData.criteria.buyerTypes.includes(type.id)
                            ? listFormData.criteria.buyerTypes.filter(t => t !== type.id)
                            : [...listFormData.criteria.buyerTypes, type.id];
                          handleCriteriaChange("buyerTypes", updatedTypes);
                        }}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isVip"
                    checked={listFormData.criteria.isVIP}
                    onCheckedChange={(checked) => handleCriteriaChange("isVIP", checked)}
                  />
                  <Label htmlFor="edit-isVip">VIP Buyers Only</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="py-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="edit-csv-file">Import additional buyers from CSV</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-[#324c48] text-[#324c48]"
                    onClick={() => document.getElementById('edit-csv-file').click()}
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                  <input
                    id="edit-csv-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCsvFileChange}
                  />
                </div>
                
                {csvFile && (
                  <div className="flex items-center gap-2 p-2 bg-[#f0f5f4] rounded-lg">
                    <FileText className="h-5 w-5 text-[#324c48]" />
                    <span className="font-medium">{csvFile.name}</span>
                    <span className="text-sm text-gray-500">
                      ({(csvFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto h-8 w-8 p-0 text-gray-500"
                      onClick={() => {
                        setCsvFile(null);
                        setCsvData([]);
                        setCsvErrors([]);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                )}
                
                {csvErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="font-medium text-red-700">CSV Import Errors</p>
                    </div>
                    <ul className="pl-5 list-disc text-sm text-red-600 space-y-1">
                      {csvErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {csvData.length > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <p className="font-medium text-green-700">
                        {csvData.length} buyers ready to import
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="p-3 bg-[#f0f5f4] rounded-lg">
                  <p className="text-sm font-medium text-[#324c48] mb-2">
                    CSV Format Requirements:
                  </p>
                  <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1">
                    <li>Required columns: firstName, lastName, email, phone</li>
                    <li>Optional columns: buyerType, preferredAreas (comma separated)</li>
                    <li>First row should be column headers</li>
                  </ul>
                  <p className="text-sm mt-2">
                    <a href="#" className="text-[#324c48] underline" onClick={(e) => {
                      e.preventDefault();
                      const csv = "firstName,lastName,email,phone,buyerType,preferredAreas\nJohn,Doe,john@example.com,(555) 123-4567,Builder,\"Austin, DFW\"\nJane,Smith,jane@example.com,(555) 987-6543,Investor,Houston";
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'buyer_list_template.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      Download template
                    </a>
                  </p>
                </div>
                
                <div className="bg-[#f0f5f4]/50 p-3 rounded-lg space-y-3">
                  <p className="text-sm font-medium text-[#324c48]">
                    Default values for missing fields:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="edit-defaultBuyerType" className="text-sm">Default Buyer Type</Label>
                      <Select
                        value={importOptions.defaultBuyerType}
                        onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultBuyerType: value }))}
                      >
                        <SelectTrigger id="edit-defaultBuyerType" className="text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUYER_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="edit-defaultArea" className="text-sm">Default Area</Label>
                      <Select
                        value={importOptions.defaultArea}
                        onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultArea: value }))}
                      >
                        <SelectTrigger id="edit-defaultArea" className="text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AREAS.map(area => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-skipFirstRow"
                      checked={importOptions.skipFirstRow}
                      onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, skipFirstRow: checked }))}
                    />
                    <Label htmlFor="edit-skipFirstRow" className="text-sm">Skip first row (header row)</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateList} className="bg-[#324c48] text-white">
              Update List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email List Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to List</DialogTitle>
            <DialogDescription>
              {selectedList && (
                <>
                  This will send an email to all buyers in the {lists.find(l => l.id === selectedList)?.name} list
                  ({lists.find(l => l.id === selectedList)?.buyerCount} buyers).
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={emailData.subject}
                onChange={handleEmailChange}
                placeholder="Enter email subject"
                className="border-[#324c48]/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                name="content"
                value={emailData.content}
                onChange={handleEmailChange}
                placeholder="Enter your email message..."
                className="min-h-[200px] border-[#324c48]/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Available Placeholders:</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-100">
                  {"{firstName}"}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  {"{lastName}"}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  {"{email}"}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  {"{preferredAreas}"}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              className="bg-[#324c48] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Buyers to List Dialog */}
      <Dialog open={addBuyersOpen} onOpenChange={setAddBuyersOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Buyers to List</DialogTitle>
            <DialogDescription>
              {selectedList && (
                <>
                  Select buyers to add to the {lists.find(l => l.id === selectedList)?.name} list.
                  Currently showing available buyers.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search buyers..."
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  className="pl-9 border-[#324c48]/30"
                />
              </div>
              
              <div className="w-full sm:w-40">
                <Select
                  value={buyerTypeFilter}
                  onValueChange={setBuyerTypeFilter}
                >
                  <SelectTrigger className="border-[#324c48]/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {BUYER_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#324c48] text-[#324c48]"
                  onClick={handleOpenCsvUpload}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#324c48] text-[#324c48]"
                  onClick={() => {
                    setFilteredBuyers([...availableBuyers]);
                    setBuyerSearchQuery("");
                    setBuyerTypeFilter("all");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            
            {selectedBuyers.length > 0 && (
              <div className="bg-[#f0f5f4] mb-4 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-[#324c48]">
                  {selectedBuyers.length} buyers selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-red-600"
                  onClick={() => setSelectedBuyers([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedBuyers.length > 0 && selectedBuyers.length === filteredBuyers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBuyers(filteredBuyers.map(b => b.id));
                          } else {
                            setSelectedBuyers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Areas</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyers.length > 0 ? (
                    filteredBuyers.map((buyer) => (
                      <TableRow key={buyer.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBuyers.includes(buyer.id)}
                            onCheckedChange={() => handleSelectBuyer(buyer.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {buyer.firstName} {buyer.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{buyer.email}</div>
                          <div className="text-xs text-gray-500">{buyer.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${buyer.buyerType === 'CashBuyer' ? 'bg-green-100 text-green-800' : ''}
                              ${buyer.buyerType === 'Investor' ? 'bg-blue-100 text-blue-800' : ''}
                              ${buyer.buyerType === 'Realtor' ? 'bg-purple-100 text-purple-800' : ''}
                              ${buyer.buyerType === 'Builder' ? 'bg-orange-100 text-orange-800' : ''}
                              ${buyer.buyerType === 'Developer' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${buyer.buyerType === 'Wholesaler' ? 'bg-indigo-100 text-indigo-800' : ''}
                            `}
                          >
                            {buyer.buyerType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {buyer.preferredAreas && buyer.preferredAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {buyer.source === 'VIP Buyers List' ? (
                            <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                          ) : (
                            buyer.source
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No buyers match the current search/filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBuyers([]);
                setAddBuyersOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBuyersToList}
              className="bg-[#324c48] text-white"
              disabled={selectedBuyers.length === 0}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add {selectedBuyers.length} Buyers to List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage List Members Dialog */}
      <Dialog open={manageBuyersOpen} onOpenChange={setManageBuyersOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage List Members</DialogTitle>
            <DialogDescription>
              {selectedList && (
                <>
                  View and manage buyers in the {lists.find(l => l.id === selectedList)?.name} list.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-9 border-[#324c48]/30"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-[#324c48] text-[#324c48]"
                onClick={() => setAddBuyersOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Buyers
              </Button>
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="bg-[#f0f5f4] mb-4 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-[#324c48]">
                  {selectedMembers.length} members selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-red-600"
                    onClick={handleRemoveMembersFromList}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => setSelectedMembers([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMembers(filteredMembers.map(b => b.id));
                          } else {
                            setSelectedMembers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Areas</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((buyer) => (
                      <TableRow key={buyer.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedMembers.includes(buyer.id)}
                            onCheckedChange={() => handleSelectMember(buyer.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {buyer.firstName} {buyer.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{buyer.email}</div>
                          <div className="text-xs text-gray-500">{buyer.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${buyer.buyerType === 'CashBuyer' ? 'bg-green-100 text-green-800' : ''}
                              ${buyer.buyerType === 'Investor' ? 'bg-blue-100 text-blue-800' : ''}
                              ${buyer.buyerType === 'Realtor' ? 'bg-purple-100 text-purple-800' : ''}
                              ${buyer.buyerType === 'Builder' ? 'bg-orange-100 text-orange-800' : ''}
                              ${buyer.buyerType === 'Developer' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${buyer.buyerType === 'Wholesaler' ? 'bg-indigo-100 text-indigo-800' : ''}
                            `}
                          >
                            {buyer.buyerType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {buyer.preferredAreas && buyer.preferredAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {buyer.source === 'VIP Buyers List' ? (
                            <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                          ) : (
                            buyer.source
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {memberSearchQuery
                          ? "No members match your search."
                          : "This list has no members yet. Click 'Add Buyers' to add some."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setManageBuyersOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={csvUploadOpen} onOpenChange={setCsvUploadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Buyers from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with buyer information to import
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="csv-upload-file">Select CSV File</Label>
              <Button 
                type="button" 
                variant="outline" 
                className="border-[#324c48] text-[#324c48]"
                onClick={() => document.getElementById('csv-upload-file').click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <input
                id="csv-upload-file"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvFileChange}
              />
            </div>
            
            {csvFile && (
              <div className="flex items-center gap-2 p-2 bg-[#f0f5f4] rounded-lg">
                <FileText className="h-5 w-5 text-[#324c48]" />
                <span className="font-medium">{csvFile.name}</span>
                <span className="text-sm text-gray-500">
                  ({(csvFile.size / 1024).toFixed(1)} KB)
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-8 w-8 p-0 text-gray-500"
                  onClick={() => {
                    setCsvFile(null);
                    setCsvData([]);
                    setCsvErrors([]);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            )}
            
            {csvErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="font-medium text-red-700">CSV Import Errors</p>
                </div>
                <ul className="pl-5 list-disc text-sm text-red-600 space-y-1">
                  {csvErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {csvData.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <p className="font-medium text-green-700">
                    {csvData.length} buyers ready to import
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-3 bg-[#f0f5f4] rounded-lg">
              <p className="text-sm font-medium text-[#324c48] mb-2">
                CSV Format Requirements:
              </p>
              <ul className="pl-5 list-disc text-sm text-gray-600 space-y-1">
                <li>Required columns: firstName, lastName, email, phone</li>
                <li>Optional columns: buyerType, preferredAreas (comma separated)</li>
                <li>First row should be column headers</li>
              </ul>
              <p className="text-sm mt-2">
                <a href="#" className="text-[#324c48] underline" onClick={(e) => {
                  e.preventDefault();
                  const csv = "firstName,lastName,email,phone,buyerType,preferredAreas\nJohn,Doe,john@example.com,(555) 123-4567,Builder,\"Austin, DFW\"\nJane,Smith,jane@example.com,(555) 987-6543,Investor,Houston";
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'buyer_list_template.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  Download template
                </a>
              </p>
            </div>
            
            <div className="bg-[#f0f5f4]/50 p-3 rounded-lg space-y-3">
              <p className="text-sm font-medium text-[#324c48]">
                Default values for missing fields:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="csv-defaultBuyerType" className="text-sm">Default Buyer Type</Label>
                  <Select
                    value={importOptions.defaultBuyerType}
                    onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultBuyerType: value }))}
                  >
                    <SelectTrigger id="csv-defaultBuyerType" className="text-sm h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUYER_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="csv-defaultArea" className="text-sm">Default Area</Label>
                  <Select
                    value={importOptions.defaultArea}
                    onValueChange={(value) => setImportOptions(prev => ({ ...prev, defaultArea: value }))}
                  >
                    <SelectTrigger id="csv-defaultArea" className="text-sm h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map(area => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="csv-skipFirstRow"
                  checked={importOptions.skipFirstRow}
                  onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, skipFirstRow: checked }))}
                />
                <Label htmlFor="csv-skipFirstRow" className="text-sm">Skip first row (header row)</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCsvUploadOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#324c48] text-white"
              disabled={csvData.length === 0}
              onClick={() => {
                if (selectedList) {
                  handleAddCsvBuyersToList(selectedList);
                } else {
                  // For creating a new list, we'll store the CSV data and process it after list creation
                  setCsvUploadOpen(false);
                }
              }}
            >
              Import {csvData.length} Buyers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}