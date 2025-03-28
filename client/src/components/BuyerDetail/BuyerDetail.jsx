import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { getBuyerById } from "@/utils/api";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon,
  PencilIcon, 
  TrashIcon
} from "lucide-react";

export default function BuyerDetail() {
  const { buyerId } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        setLoading(true);
        const data = await getBuyerById(buyerId);
        setBuyer(data);
      } catch (err) {
        console.error("Error fetching buyer:", err);
        setError("Failed to load buyer details");
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchBuyer();
    }
  }, [buyerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PuffLoader size={80} color="#3f4f24" />
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-800">
              <h2 className="text-xl font-semibold mb-2">Error Loading Buyer</h2>
              <p>{error || "Buyer not found"}</p>
              <Button 
                onClick={() => navigate("/admin/buyers")}
                variant="outline" 
                className="mt-4"
              >
                Back to Buyers List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/buyers/${buyerId}/edit`);
  };

  const handleViewOffers = () => {
    navigate(`/admin/buyers/${buyerId}/offers`);
  };

  const handleDeleteConfirm = async () => {
    // Implement delete functionality
    try {
      // await deleteBuyer(buyerId);
      navigate("/admin/buyers");
    } catch (err) {
      console.error("Error deleting buyer:", err);
      setError("Failed to delete buyer");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#324c48]">Buyer Profile</h1>
          <p className="text-gray-600">View and manage buyer information</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#324c48] text-[#324c48]"
            onClick={handleEdit}
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            className="bg-[#324c48] text-white hover:bg-[#3f4f24]"
            onClick={handleViewOffers}
          >
            View Offers
          </Button>
        </div>
      </div>

      <Card className="border-[#324c48]/20 shadow-md">
        <CardHeader className="bg-[#f0f5f4] border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[#3f4f24] text-2xl">
                {buyer.firstName} {buyer.lastName}
              </CardTitle>
              <CardDescription className="text-[#324c48] font-medium">
                {buyer.email}
              </CardDescription>
            </div>
            <Badge 
              className={`
                px-4 py-2 text-sm
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
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="details">Buyer Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-5 w-5 text-[#324c48]" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{buyer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-[#324c48]" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{buyer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-[#324c48]" />
                    <div>
                      <p className="text-sm text-gray-500">Source</p>
                      <div>
                        {buyer.source === 'VIP Buyers List' ? (
                          <Badge className="bg-[#D4A017] text-white">VIP Buyers List</Badge>
                        ) : (
                          <span className="font-medium">{buyer.source || 'Unknown'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-[#324c48]" />
                    <div>
                      <p className="text-sm text-gray-500">Preferred Areas</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {buyer.preferredAreas && buyer.preferredAreas.length > 0 ? (
                          buyer.preferredAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="border-[#324c48]/30">
                              {area}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">No preferred areas specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-[#324c48]" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {format(new Date(buyer.createdAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="bg-[#f0f5f4] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-[#3f4f24] mb-2">Offers Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Total Offers</p>
                    <p className="text-2xl font-bold text-[#324c48]">
                      {buyer.offers?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Latest Offer</p>
                    <p className="text-xl font-bold text-[#324c48]">
                      {buyer.offers && buyer.offers.length > 0 
                        ? format(new Date(buyer.offers[0].timestamp), 'MMM d, yyyy')
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Average Offer</p>
                    <p className="text-xl font-bold text-[#324c48]">
                      {buyer.offers && buyer.offers.length > 0 
                        ? `$${Math.floor(buyer.offers.reduce((acc, curr) => acc + parseFloat(curr.offeredPrice), 0) / buyer.offers.length).toLocaleString()}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    className="text-[#324c48] border-[#324c48]"
                    onClick={handleViewOffers}
                  >
                    View All Offers
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="bg-[#f0f5f4] p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium text-[#3f4f24] mb-4">Activity Timeline</h3>
                <p className="text-gray-500">
                  Activity tracking will be implemented in a future update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t flex justify-between py-4">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Buyer
          </Button>
          
          <Button
            onClick={() => navigate("/admin/buyers")}
            variant="ghost"
          >
            Back to Buyers List
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Buyer</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this buyer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}