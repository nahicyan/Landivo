import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBuyers } from "@/utils/api";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

import BuyersTable from "./BuyersTable";
import BuyerStats from "./BuyerStats";
import BuyerAreasTab from "./BuyerAreasTab";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Mail, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Send, 
  FileUp, 
  Download 
} from "lucide-react";

// Import constants and utils
import { AREAS, BUYER_TYPES } from "./buyerConstants";

const BuyersContainer = () => {
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
        // Initialize with empty arrays if data is undefined
        const buyersData = data || [];
        setBuyers(buyersData);
        setFilteredBuyers(buyersData);
        updateStats(buyersData);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        toast.error("Failed to load buyers list");
        // Initialize with empty arrays on error
        setBuyers([]);
        setFilteredBuyers([]);
        updateStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Update stats when buyers change
  const updateStats = (buyersList = []) => {
    const newStats = {
      total: buyersList?.length || 0,
      vip: (buyersList || []).filter(b => b?.source === "VIP Buyers List").length,
      byArea: {},
      byType: {}
    };

    // Initialize area counts to zero
    AREAS.forEach(area => {
      newStats.byArea[area.id] = 0;
    });

    // Count buyers by area - fixed to properly match lowercase area values
    (buyersList || []).forEach(buyer => {
      if (buyer?.preferredAreas && Array.isArray(buyer.preferredAreas)) {
        buyer.preferredAreas.forEach(area => {
          if (area) {
            // Find the area object that matches the lowercase area value
            const areaObj = AREAS.find(a => 
              a.value === area.toLowerCase() || 
              a.id.toLowerCase() === area.toLowerCase()
            );
            
            if (areaObj) {
              newStats.byArea[areaObj.id] = (newStats.byArea[areaObj.id] || 0) + 1;
            }
          }
        });
      }
    });

    // Count buyers by type
    (buyersList || []).forEach(buyer => {
      if (buyer?.buyerType) {
        newStats.byType[buyer.buyerType] = (newStats.byType[buyer.buyerType] || 0) + 1;
      }
    });

    setStats(newStats);
  };

  // Apply filters to buyers
  useEffect(() => {
    const applyFilters = () => {
      // Make a defensive copy of buyers array
      let results = buyers ? [...buyers] : [];

      // Apply search query filter
      if (searchQuery?.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(buyer => 
          (buyer?.firstName || '').toLowerCase().includes(query) ||
          (buyer?.lastName || '').toLowerCase().includes(query) ||
          (buyer?.email || '').toLowerCase().includes(query) ||
          (buyer?.phone || '').includes(query)
        );
      }

      // Apply area filter
      if (areaFilter && areaFilter !== "all") {
        const areaValue = AREAS.find(a => a.id === areaFilter)?.value || areaFilter.toLowerCase();
        results = results.filter(buyer => 
          buyer?.preferredAreas && Array.isArray(buyer.preferredAreas) && buyer.preferredAreas.some(area => 
            area && area.toLowerCase() === areaValue
          )
        );
      }

      // Apply buyer type filter
      if (buyerTypeFilter && buyerTypeFilter !== "all") {
        results = results.filter(buyer => buyer?.buyerType === buyerTypeFilter);
      }

      // Apply source filter
      if (sourceFilter && sourceFilter !== "all") {
        results = results.filter(buyer => buyer?.source === sourceFilter);
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
      // Make sure filteredBuyers is defined and has length
      if (filteredBuyers && filteredBuyers.length > 0) {
        setSelectedBuyers(filteredBuyers.map(buyer => buyer.id));
      }
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

  // Get buyers for a specific area with proper case-insensitive matching
  const getBuyersForArea = (areaId) => {
    if (!buyers || !Array.isArray(buyers) || !areaId) return [];
    
    const areaValue = AREAS.find(a => a.id === areaId)?.value || areaId.toLowerCase();
    return buyers.filter(b => 
      b?.preferredAreas && Array.isArray(b.preferredAreas) && b.preferredAreas.some(area => 
        area && area.toLowerCase() === areaValue
      )
    );
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
      {/* Stats Cards */}
      <BuyerStats stats={stats} selectedCount={selectedBuyers.length} />

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
            <BuyersTable 
              filteredBuyers={filteredBuyers}
              buyers={buyers}
              selectedBuyers={selectedBuyers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              areaFilter={areaFilter}
              setAreaFilter={setAreaFilter}
              buyerTypeFilter={buyerTypeFilter}
              setBuyerTypeFilter={setBuyerTypeFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              onSelectBuyer={handleSelectBuyer}
              onSelectAll={handleSelectAll}
              onDeleteSelected={handleDeleteSelected}
              setEmailDialogOpen={setEmailDialogOpen}
              setBulkImportOpen={setBulkImportOpen}
              onExport={handleExport}
              navigate={navigate}
            />
          </Card>
        </TabsContent>
        
        {/* By Area Tab */}
        <TabsContent value="areas">
          <BuyerAreasTab 
            areas={AREAS}
            stats={stats}
            getBuyersForArea={getBuyersForArea}
            setAreaFilter={setAreaFilter}
            setSelectedBuyers={setSelectedBuyers}
            setEmailDialogOpen={setEmailDialogOpen}
          />
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <Card.Header>
              <Card.Title>Buyer List Analytics</Card.Title>
              <Card.Description>
                Insights into your buyer database
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buyer Types Chart */}
                <Card className="border border-[#324c48]/20">
                  <Card.Header className="bg-[#f0f5f4] border-b">
                    <Card.Title>Buyer Types</Card.Title>
                  </Card.Header>
                  <Card.Content className="p-4 min-h-[300px]">
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
                  </Card.Content>
                </Card>
                
                {/* Areas Distribution Chart */}
                <Card className="border border-[#324c48]/20">
                  <Card.Header className="bg-[#f0f5f4] border-b">
                    <Card.Title>Area Distribution</Card.Title>
                  </Card.Header>
                  <Card.Content className="p-4 min-h-[300px]">
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
                  </Card.Content>
                </Card>
                
                {/* Growth Over Time */}
                <Card className="border border-[#324c48]/20 md:col-span-2">
                  <Card.Header className="bg-[#f0f5f4] border-b">
                    <Card.Title>Buyer List Growth</Card.Title>
                  </Card.Header>
                  <Card.Content className="p-4 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p>Historical growth data will be available soon</p>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </Card.Content>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
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

      {/* Bulk Import Sheet */}
      <Sheet open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
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
    </div>
  );
};

export default BuyersContainer;