import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import useBuyers from "@/components/hooks/useBuyers";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Filter } from "lucide-react";

export default function BuyersTable() {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useBuyers();
  const [searchQuery, setSearchQuery] = useState("");
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Filter the buyers based on the search query and filters
  const filteredBuyers = useMemo(() => {
    if (!data) return [];
    
    return data.filter((buyer) => {
      // Search query filtering
      const searchFields = [
        buyer.firstName,
        buyer.lastName,
        buyer.email,
        buyer.phone,
      ];
      
      const matchesSearchQuery = !searchQuery || searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Buyer type filtering
      const matchesBuyerType = buyerTypeFilter === "all" || buyer.buyerType === buyerTypeFilter;
      
      // Source filtering
      const matchesSource = sourceFilter === "all" || buyer.source === sourceFilter;
      
      return matchesSearchQuery && matchesBuyerType && matchesSource;
    });
  }, [data, searchQuery, buyerTypeFilter, sourceFilter]);

  // Determine all available sources for filtering
  const availableSources = useMemo(() => {
    if (!data) return [];
    const sources = new Set();
    data.forEach(buyer => {
      if (buyer.source) sources.add(buyer.source);
    });
    return Array.from(sources);
  }, [data]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-red-600 text-xl font-semibold">Error fetching buyers data.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#404040" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Buyers</CardTitle>
        <CardDescription>
          Manage your buyer database and view VIP members.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start mb-6">
          {/* Search Input */}
          <div className="w-full lg:flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Buyer Type Filter */}
          <div className="w-full lg:w-1/5">
            <Select
              value={buyerTypeFilter}
              onValueChange={setBuyerTypeFilter}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Buyer Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buyer Types</SelectItem>
                <SelectItem value="CashBuyer">Cash Buyer</SelectItem>
                <SelectItem value="Builder">Builder</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Realtor">Realtor</SelectItem>
                <SelectItem value="Investor">Investor</SelectItem>
                <SelectItem value="Wholesaler">Wholesaler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter */}
          <div className="w-full lg:w-1/5">
            <Select
              value={sourceFilter}
              onValueChange={setSourceFilter}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Source" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {availableSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          {filteredBuyers.length} {filteredBuyers.length === 1 ? "buyer" : "buyers"} found
        </div>

        {/* Buyers Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.length > 0 ? (
                filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell className="font-medium">
                      {buyer.firstName} {buyer.lastName}
                    </TableCell>
                    <TableCell>{buyer.email}</TableCell>
                    <TableCell>{buyer.phone}</TableCell>
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
                      ) : buyer.source || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(buyer.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No buyers found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}