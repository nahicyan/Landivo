import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Download, 
  MoreVertical, 
  FileUp,
  Eye
} from "lucide-react";

// Import constants
import { AREAS, BUYER_TYPES, getBuyerTypeClass } from "./buyerConstants";

/**
 * BuyersTable component - Displays a table of buyers with filtering and actions
 */
const BuyersTable = ({ 
  filteredBuyers = [],
  buyers = [],
  selectedBuyers = [],
  searchQuery = "",
  setSearchQuery = () => {},
  areaFilter = "all",
  setAreaFilter = () => {},
  buyerTypeFilter = "all",
  setBuyerTypeFilter = () => {},
  sourceFilter = "all",
  setSourceFilter = () => {},
  onSelectBuyer = () => {},
  onSelectAll = () => {},
  onDeleteSelected = () => {},
  setEmailDialogOpen = () => {},
  setBulkImportOpen = () => {},
  onExport = () => {},
  onViewActivity = () => {},
  navigate = null,
}) => {
  // Use the passed navigate prop or get it from useNavigate
  const routerNavigate = useNavigate();
  const navigateTo = navigate || routerNavigate;

  // Generate activity score from ID (for demo purposes)
  const getActivityScore = (buyerId) => {
    // Make sure we have a valid ID string
    if (!buyerId || typeof buyerId !== 'string') {
      return Math.floor(Math.random() * 100); // Fallback to random score
    }
    
    try {
      const idHash = buyerId.substring(0, 8);
      const hash = parseInt(idHash, 16) || Math.floor(Math.random() * 1000);
      return Math.floor(hash % 100);
    } catch (error) {
      console.warn("Error generating activity score:", error);
      return Math.floor(Math.random() * 100); // Fallback to random score
    }
  };

  return (
    <>
      <CardHeader className="bg-[#f0f5f4] border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Buyers List</CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={() => navigateTo("/admin/buyers/create")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Buyer
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={() => setBulkImportOpen(true)}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-[#324c48] text-[#324c48]"
              onClick={onExport}
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
                  {BUYER_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
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
                <SelectItem value="CSV Import">CSV Import</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedBuyers.length > 0 && (
          <div className="p-3 bg-[#f0f5f4] border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-[#324c48]">
              {selectedBuyers.length} buyers selected
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-[#324c48] text-white"
                onClick={() => setEmailDialogOpen(true)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Selected
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={onDeleteSelected}
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
                    onCheckedChange={onSelectAll}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Areas</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.length > 0 ? (
                filteredBuyers.map(buyer => {
                  const activityScore = getActivityScore(buyer.id);
                  
                  return (
                    <TableRow key={buyer.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedBuyers.includes(buyer.id)}
                          onCheckedChange={() => onSelectBuyer(buyer.id)}
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
                          {buyer?.preferredAreas && Array.isArray(buyer.preferredAreas) && buyer.preferredAreas.length > 0 ? (
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
                          className={getBuyerTypeClass(buyer.buyerType)}
                        >
                          {buyer.buyerType || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
                            <div 
                              className={`h-full rounded-full ${
                                activityScore >= 80 ? 'bg-green-500' :
                                activityScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${activityScore}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-gray-100"
                              onClick={() => onViewActivity(buyer)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Activity
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {buyer?.source === 'VIP Buyers List' ? (
                          <Badge className="bg-[#D4A017] text-white">VIP</Badge>
                        ) : (
                          <span className="text-sm">{buyer?.source || 'Unknown'}</span>
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
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigateTo(`/admin/buyers/${buyer.id}/offers`)}>
                              View Offers
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewActivity(buyer)}>
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                onSelectBuyer(buyer.id);
                                setTimeout(() => onDeleteSelected(), 100);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {searchQuery || areaFilter !== "all" || buyerTypeFilter !== "all" || sourceFilter !== "all" 
                      ? "No buyers found matching your filters." 
                      : "No buyers found. Add your first buyer to get started!"}
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
          onClick={() => navigateTo("/admin/buyers/create")}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Buyer
        </Button>
      </CardFooter>
    </>
  );
};

export default BuyersTable;