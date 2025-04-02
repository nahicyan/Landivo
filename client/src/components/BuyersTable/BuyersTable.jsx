import React from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { format } from "date-fns";

// Import constants
import { AREAS, BUYER_TYPES, getBuyerTypeClass } from "./buyerConstants";

/**
 * BuyersTable component - Displays a table of buyers with filtering and actions
 * 
 * @param {Object} props
 * @param {Array} props.filteredBuyers - Filtered list of buyers to display
 * @param {Array} props.buyers - Complete list of buyers (for counts)
 * @param {Array} props.selectedBuyers - Array of selected buyer IDs
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.areaFilter - Current area filter
 * @param {Function} props.setAreaFilter - Function to update area filter
 * @param {string} props.buyerTypeFilter - Current buyer type filter
 * @param {Function} props.setBuyerTypeFilter - Function to update buyer type filter
 * @param {string} props.sourceFilter - Current source filter
 * @param {Function} props.setSourceFilter - Function to update source filter
 * @param {Function} props.onSelectBuyer - Function to handle buyer selection
 * @param {Function} props.onSelectAll - Function to handle select all
 * @param {Function} props.onDeleteSelected - Function to delete selected buyers
 * @param {Function} props.setEmailDialogOpen - Function to open email dialog
 * @param {Function} props.setBulkImportOpen - Function to open bulk import dialog
 * @param {Function} props.onExport - Function to export buyers
 * @param {Function} props.onViewActivity - Function to view buyer activity
 * @param {Object} props.navigate - React Router navigate function
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
  navigate = () => {},
}) => {
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
              onClick={() => navigate("/admin/buyers/create")}
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
                  // Generate an activity score between 0-100 based on the buyer's ID
                  const activityScore = Math.floor(parseInt(buyer.id.substring(0, 8), 16) % 100);
                  
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
                          className={getBuyerTypeClass(buyer.buyerType)}
                        >
                          {buyer.buyerType}
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
                              onClick={() => onViewActivity && onViewActivity(buyer)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Activity
                            </Badge>
                          </div>
                        </div>
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
                            {onViewActivity && (
                              <DropdownMenuItem onClick={() => onViewActivity(buyer)}>
                                View Activity
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                onSelectBuyer(buyer.id);
                                onDeleteSelected();
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
    </>
  );
};

export default BuyersTable;