import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuyers } from "@/utils/api";
import { PuffLoader } from "react-spinners";
import { format } from "date-fns";
import { toast } from "react-toastify";

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
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Mail, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Send, 
  FileUp, 
  Download, 
  MoreVertical, 
  Tag,
  Users,
  MailCheck
} from "lucide-react";

// Define the available areas
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth' },
  { id: 'Austin', label: 'Austin' },
  { id: 'Houston', label: 'Houston' },
  { id: 'San Antonio', label: 'San Antonio' },
  { id: 'Other Areas', label: 'Other Areas' }
];

export default function BuyersTable() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
    includeUnsubscribed: false
  });
  const [stats, setStats] = useState({
    total: 0,
    vip: 0,
    byArea: {},
    byType: {}
  });

  // Fetch buyers data
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const data = await getAllBuyers();
        setBuyers(data);
        setFilteredBuyers(data);
        updateStats(data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        toast.error("Failed to load buyers list");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Update stats when buyers change
  const updateStats = (buyersList) => {
    const newStats = {
      total: buyersList.length,
      vip: buyersList.filter(b => b.source === "VIP Buyers List").length,
      byArea: {},
      byType: {}
    };

    // Count buyers by area
    AREAS.forEach(area => {
      newStats.byArea[area.id] = buyersList.filter(
        b => b.preferredAreas && b.preferredAreas.includes(area.id)
      ).length;
    });

    // Count buyers by type
    buyersList.forEach(buyer => {
      if (buyer.buyerType) {
        newStats.byType[buyer.buyerType] = (newStats.byType[buyer.buyerType] || 0) + 1;
      }
    });

    setStats(newStats);
  };

  // Apply filters to buyers
  useEffect(() => {
    const applyFilters = () => {
      let results = [...buyers];

      // Apply search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(buyer => 
          buyer.firstName.toLowerCase().includes(query) ||
          buyer.lastName.toLowerCase().includes(query) ||
          buyer.email.toLowerCase().includes(query) ||
          buyer.phone.includes(query)
        );
      }

      // Apply area filter
      if (areaFilter !== "all") {
        results = results.filter(buyer => 
          buyer.preferredAreas && buyer.preferredAreas.includes(areaFilter)
        );
      }

      // Apply buyer type filter
      if (buyerTypeFilter !== "all") {
        results = results.filter(buyer => buyer.buyerType === buyerTypeFilter);
      }

      // Apply source filter
      if (sourceFilter !== "all") {
        results = results.filter(buyer => buyer.source === sourceFilter);
      }

      setFilteredBuyers(results);
    };

    applyFilters();
  }, [buyers, searchQuery, areaFilter, buyerTypeFilter, sourceFilter]);

  // Handle buyer selection
  const handleSelectBuyer = (buyerId) => {
    setSelectedBuyers(prev => {
      if (prev.includes(buyerId)) {
        return prev.filter(id => id !== buyerId);
      } else {
        return [...prev, buyerId];
      }
    });
  };

  // Handle select all buyers
  const handleSelectAll = (event) => {
    if (event) {
      setSelectedBuyers(filteredBuyers.map(buyer => buyer.id));
    } else {
      setSelectedBuyers([]);
    }
  };

  // Handle email content change
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sending email to selected buyers
  const handleSendEmail = async () => {
    try {
      // Get the selected buyers' data
      const selectedBuyersData = buyers.filter(buyer => 
        selectedBuyers.includes(buyer.id)
      );

      // Here you would normally call an API to send emails
      toast.success(`Email sent to ${selectedBuyersData.length} buyers!`);
      
      // Reset the form and close the dialog
      setEmailData({
        subject: "",
        content: "",
        includeUnsubscribed: false
      });
      setEmailDialogOpen(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send emails");
    }
  };

  // Handle bulk import functionality
  const handleBulkImport = (e) => {
    // This would handle CSV upload and processing
    // For now, just close the dialog and show a toast
    toast.info("Bulk import functionality will be implemented soon");
    setBulkImportOpen(false);
  };

  // Handle buyer deletion
  const handleDeleteSelected = async () => {
    try {
      // In a real app, you would call an API to delete these buyers
      // For now, just remove them from the local state
      const updatedBuyers = buyers.filter(buyer => !selectedBuyers.includes(buyer.id));
      setBuyers(updatedBuyers);
      setSelectedBuyers([]);
      updateStats(updatedBuyers);
      toast.success(`${selectedBuyers.length} buyers deleted successfully`);
    } catch (error) {
      console.error("Error deleting buyers:", error);
      toast.error("Failed to delete selected buyers");
    }
  };

  // Export buyer list
  const handleExport = () => {
    try {
      // Get the selected buyers (or all if none selected)
      const buyersToExport = selectedBuyers.length > 0
        ? buyers.filter(buyer => selectedBuyers.includes(buyer.id))
        : filteredBuyers;

      // Convert to CSV
      const headers = ["First Name", "Last Name", "Email", "Phone", "Buyer Type", "Preferred Areas", "Source"];
      const csvRows = [headers];

      buyersToExport.forEach(buyer => {
        const row = [
          buyer.firstName,
          buyer.lastName,
          buyer.email,
          buyer.phone,
          buyer.buyerType,
          (buyer.preferredAreas || []).join(", "),
          buyer.source || "N/A"
        ];
        csvRows.push(row);
      });

      // Create CSV content
      const csvContent = csvRows.map(row => row.join(",")).join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "buyers_list.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${buyersToExport.length} buyers`);
    } catch (error) {
      console.error("Error exporting buyers:", error);
      toast.error("Failed to export buyers list");
    }
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
        <h1 className="text-2xl font-bold text-[#324c48] mb-2">Buyer List Manager</h1>
        <p className="text-gray-600">
          Manage your buyer list and send targeted emails based on their preferred areas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-[#324c48] mb-2" />
            <p className="text-sm text-gray-500">Total Buyers</p>
            <p className="text-3xl font-bold text-[#324c48]">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Tag className="h-8 w-8 text-[#D4A017] mb-2" />
            <p className="text-sm text-gray-500">VIP Subscribers</p>
            <p className="text-3xl font-bold text-[#D4A017]">{stats.vip}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Mail className="h-8 w-8 text-[#3f4f24] mb-2" />
            <p className="text-sm text-gray-500">Selected for Email</p>
            <p className="text-3xl font-bold text-[#3f4f24]">{selectedBuyers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <MailCheck className="h-8 w-8 text-[#546930] mb-2" />
            <p className="text-sm text-gray-500">Email-Ready Buyers</p>
            <p className="text-3xl font-bold text-[#546930]">
              {buyers.filter(b => b.email && !b.unsubscribed).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="bg-[#f0f5f4] p-1">
          <TabsTrigger value="list" className="data-[state=active]:bg-white">
            Buyer List
          </TabsTrigger>
          <TabsTrigger value="areas" className="data-[state=active]:bg-white">
            By Area
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Buyer List Tab */}
        <TabsContent value="list">
          <Card className="border-[#324c48]/20">
            <CardHeader className="bg-[#f0f5f4] border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Buyers List</CardTitle>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#324c48] text-[#324c48]"
                    onClick={() => navigate("/admin/buyers/create")}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Buyer
                  </Button>
                  
                  <Sheet open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="outline" className="border-[#324c48] text-[#324c48]">
                        <FileUp className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Import Buyers from CSV</SheetTitle>
                        <SheetDescription>
                          Upload a CSV file with buyer information
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="csvFile">CSV File</Label>
                            <Input id="csvFile" type="file" accept=".csv" />
                            <p className="text-sm text-gray-500">
                              File should have columns: First Name, Last Name, Email, Phone, Type, Preferred Areas (comma-separated)
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="defaultSource">Default Source</Label>
                            <Select defaultValue="Imported">
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Imported">CSV Import</SelectItem>
                                <SelectItem value="VIP Buyers List">VIP Buyers List</SelectItem>
                                <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                                <SelectItem value="Website">Website</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <SheetFooter>
                        <Button className="bg-[#324c48] text-white" onClick={handleBulkImport}>
                          Import Buyers
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#324c48] text-[#324c48]"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Search and Filters */}
              <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-[#324c48]/30"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <Select value={areaFilter} onValueChange={setAreaFilter}>
                      <SelectTrigger className="border-[#324c48]/30">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Area" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        {AREAS.map(area => (
                          <SelectItem key={area.id} value={area.id}>{area.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-1/2">
                    <Select value={buyerTypeFilter} onValueChange={setBuyerTypeFilter}>
                      <SelectTrigger className="border-[#324c48]/30">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="CashBuyer">Cash Buyer</SelectItem>
                        <SelectItem value="Builder">Builder</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Realtor">Realtor</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                        <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="border-[#324c48]/30">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Source" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="VIP Buyers List">VIP Buyers List</SelectItem>
                      <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                      <SelectItem value="Property Offer">Property Offer</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Bulk Actions */}
              {selectedBuyers.length > 0 && (
                <div className="p-3 bg-[#f0f5f4] border-b flex items-center justify-between">
                  <span className="text-sm text-[#324c48]">
                    {selectedBuyers.length} buyers selected
                  </span>
                  <div className="flex gap-2">
                    <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#324c48] text-white">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Selected
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Send Email to Selected Buyers</DialogTitle>
                          <DialogDescription>
                            This will send an email to {selectedBuyers.length} selected buyers.
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
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Buyers Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedBuyers.length === filteredBuyers.length && filteredBuyers.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className="translate-y-[2px]"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Areas</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuyers.length > 0 ? (
                      filteredBuyers.map(buyer => (
                        <TableRow key={buyer.id} className="group">
                          <TableCell>
                            <Checkbox
                              checked={selectedBuyers.includes(buyer.id)}
                              onCheckedChange={() => handleSelectBuyer(buyer.id)}
                              aria-label={`Select ${buyer.firstName}`}
                              className="translate-y-[2px]"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {buyer.firstName} {buyer.lastName}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{buyer.email}</div>
                              <div className="text-xs text-gray-500">{buyer.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {buyer.preferredAreas && buyer.preferredAreas.length > 0 ? (
                                buyer.preferredAreas.map((area, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-[#f0f5f4] text-xs">
                                    {area}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">None specified</span>
                              )}
                            </div>
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
                            {buyer.source === 'VIP Buyers List' ? (
                              <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                            ) : (
                              <span className="text-sm">{buyer.source || 'Unknown'}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {buyer.createdAt ? (
                              format(new Date(buyer.createdAt), 'MMM d, yyyy')
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/admin/buyers/${buyer.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/admin/buyers/${buyer.id}/edit`)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/admin/buyers/${buyer.id}/offers`)}>
                                  View Offers
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No buyers found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            
            <CardFooter className="justify-between py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {filteredBuyers.length} of {buyers.length} buyers
              </div>
              <Button 
                variant="outline" 
                className="border-[#324c48] text-[#324c48]"
                onClick={() => navigate("/admin/buyers/create")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Buyer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* By Area Tab */}
        <TabsContent value="areas">
          <Card>
            <CardHeader>
              <CardTitle>Buyers by Area</CardTitle>
              <CardDescription>
                Browse buyers grouped by their preferred areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AREAS.map(area => {
                  const areaCount = stats.byArea[area.id] || 0;
                  const areaBuyers = buyers.filter(b => 
                    b.preferredAreas && b.preferredAreas.includes(area.id)
                  );
                  
                  return (
                    <Card key={area.id} className="border border-[#324c48]/20">
                      <CardHeader className="bg-[#f0f5f4] border-b">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">{area.label}</CardTitle>
                          <Badge className="bg-[#3f4f24]">{areaCount}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {areaCount > 0 ? (
                          <div className="space-y-4">
                            <div className="text-sm">
                              {areaBuyers.slice(0, 3).map((buyer, idx) => (
                                <div key={idx} className="py-2 border-b border-dashed border-gray-200 last:border-0">
                                  <div className="font-medium">{buyer.firstName} {buyer.lastName}</div>
                                  <div className="text-xs text-gray-500">{buyer.email}</div>
                                </div>
                              ))}
                              {areaCount > 3 && (
                                <div className="text-center text-sm text-[#324c48] mt-2">
                                  + {areaCount - 3} more
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full border-[#324c48] text-[#324c48]"
                              onClick={() => {
                                setAreaFilter(area.id);
                                document.querySelector('[data-state="inactive"][value="list"]').click();
                              }}
                            >
                              View All {area.label} Buyers
                            </Button>
                          </div>
                        ) : (
                          <div className="py-6 text-center text-gray-500">
                            No buyers for this area
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t py-2">
                        <Button 
                          variant="ghost" 
                          className="w-full text-[#324c48]"
                          onClick={() => {
                            // Set area filter and open email dialog with only these buyers selected
                            const buyersForArea = buyers.filter(b => 
                              b.preferredAreas && b.preferredAreas.includes(area.id)
                            );
                            setSelectedBuyers(buyersForArea.map(b => b.id));
                            setEmailDialogOpen(true);
                          }}
                          disabled={areaCount === 0}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email {area.label} Buyers
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Buyer List Analytics</CardTitle>
              <CardDescription>
                Insights into your buyer database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buyer Types Chart */}
                <Card className="border border-[#324c48]/20">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Buyer Types</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px]">
                    {/* Here you'd normally have a chart */}
                    <div className="space-y-4">
                      {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <div className="w-36 font-medium">{type}</div>
                          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                type === 'CashBuyer' ? 'bg-green-400' : 
                                type === 'Investor' ? 'bg-blue-400' :
                                type === 'Realtor' ? 'bg-purple-400' :
                                type === 'Builder' ? 'bg-orange-400' :
                                type === 'Developer' ? 'bg-yellow-400' :
                                'bg-indigo-400'
                              }`}
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            />
                          </div>
                          <div className="w-10 text-right ml-2">{count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Areas Distribution Chart */}
                <Card className="border border-[#324c48]/20">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Area Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px]">
                    {/* Here you'd normally have a chart */}
                    <div className="space-y-4">
                      {AREAS.map(area => {
                        const count = stats.byArea[area.id] || 0;
                        return (
                          <div key={area.id} className="flex items-center">
                            <div className="w-36 font-medium">{area.label}</div>
                            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#3f4f24]"
                                style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                            <div className="w-10 text-right ml-2">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Growth Over Time */}
                <Card className="border border-[#324c48]/20 md:col-span-2">
                  <CardHeader className="bg-[#f0f5f4] border-b">
                    <CardTitle>Buyer List Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p>Historical growth data will be available soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}