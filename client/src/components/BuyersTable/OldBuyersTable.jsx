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
  MailCheck,
  Clock,
  MousePointer,
  Navigation,
  Eye,
  DollarSign,
  Smartphone,
  Calendar
} from "lucide-react";

// Define the available areas with both ID and lowercase value for matching
const AREAS = [
  { id: 'DFW', label: 'Dallas Fort Worth', value: 'dfw' },
  { id: 'Austin', label: 'Austin', value: 'austin' },
  { id: 'Houston', label: 'Houston', value: 'houston' },
  { id: 'San Antonio', label: 'San Antonio', value: 'san antonio' },
  { id: 'Other Areas', label: 'Other Areas', value: 'other areas' }
];

// Sample activity data for demonstration
const generateActivityData = (buyerId, firstName, lastName) => {
  // Generate property IDs and titles
  const properties = [
    { id: "residency1", title: "Modern Apartment", address: "123 Main Street, Metropolis, USA" },
    { id: "residency2", title: "Luxury Villa", address: "456 Ocean Drive, Seaside, USA" },
    { id: "residency3", title: "Mountain Cabin", address: "789 Pine Road, Highland, USA" },
    { id: "residency4", title: "Downtown Loft", address: "101 Urban Ave, Central City, USA" },
    { id: "residency5", title: "Lakefront Property", address: "202 Lake View, Waterside, USA" }
  ];
  
  // Random date generator for the last 30 days
  const randomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );
    return date.toISOString();
  };
  
  // Random duration between 30 seconds and 15 minutes
  const randomDuration = () => Math.floor(Math.random() * (15 * 60 - 30) + 30);
  
  // Random amount between 200,000 and 1,500,000
  const randomAmount = () => Math.floor(Math.random() * (1500000 - 200000) + 200000);
  
  // Generate 3-7 property views
  const propertyViews = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => {
    const property = properties[Math.floor(Math.random() * properties.length)];
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      timestamp: randomDate(),
      duration: randomDuration(),
      details: Math.random() > 0.5 ? "Viewed full property details" : "Viewed property from search results"
    };
  });
  
  // Generate 5-10 click events
  const clickEvents = Array.from({ length: Math.floor(Math.random() * 6) + 5 }, () => {
    const property = properties[Math.floor(Math.random() * properties.length)];
    const elements = [
      "Make Offer Button", 
      "Contact Agent", 
      "View Images", 
      "See Financing Options", 
      "Save to Favorites", 
      "Share Property"
    ];
    return {
      element: elements[Math.floor(Math.random() * elements.length)],
      page: `/properties/${property.id}`,
      timestamp: randomDate()
    };
  });
  
  // Generate 3-5 page visits
  const pageVisits = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, () => {
    const pages = [
      "/properties", 
      "/properties/search", 
      `/properties/${properties[Math.floor(Math.random() * properties.length)].id}`,
      "/financing",
      "/about-us"
    ];
    return {
      url: pages[Math.floor(Math.random() * pages.length)],
      timestamp: randomDate(),
      duration: randomDuration()
    };
  });
  
  // Generate 1-3 searches
  const searchHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    const queries = [
      "land near Austin", 
      "waterfront property", 
      "investment opportunity", 
      "vacant land Texas", 
      "affordable acreage"
    ];
    return {
      query: queries[Math.floor(Math.random() * queries.length)],
      timestamp: randomDate(),
      results: Math.floor(Math.random() * 20) + 1
    };
  });
  
  // Generate 0-2 offers
  const offerHistory = Array.from({ length: Math.floor(Math.random() * 3) }, () => {
    const property = properties[Math.floor(Math.random() * properties.length)];
    const statuses = ["Pending", "Accepted", "Rejected", "Countered"];
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      amount: randomAmount(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: randomDate()
    };
  });
  
  // Generate 1-2 email interactions
  const emailInteractions = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => {
    const subjects = [
      "March 2025 Property Listings", 
      "Special Land Offer Near You", 
      "New Properties Available", 
      "Your Saved Properties Update"
    ];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const emailId = `email-${subject.toLowerCase().replace(/\s+/g, '-')}`;
    const openTimestamp = randomDate();
    const property = properties[Math.floor(Math.random() * properties.length)];
    
    return {
      emailId,
      subject,
      opened: Math.random() > 0.2, // 80% chance email was opened
      openTimestamp,
      clicks: Math.random() > 0.4 ? [ // 60% chance they clicked something in the email
        {
          url: `/properties/${property.id}`,
          timestamp: new Date(new Date(openTimestamp).getTime() + Math.random() * 300000).toISOString() // 0-5 minutes after opening
        }
      ] : []
    };
  });
  
  // Generate 1-3 sessions
  const sessionHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    const loginTime = randomDate();
    const logoutTime = new Date(new Date(loginTime).getTime() + Math.random() * 3600000).toISOString(); // 0-60 minutes after login
    const devices = [
      "Desktop - Chrome on Windows",
      "Desktop - Safari on MacOS",
      "Mobile - Chrome on Android",
      "Mobile - Safari on iOS",
      "Tablet - Chrome on iPadOS"
    ];
    return {
      loginTime,
      logoutTime,
      device: devices[Math.floor(Math.random() * devices.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };
  });
  
  return {
    buyerId,
    buyerName: `${firstName} ${lastName}`,
    propertyViews,
    clickEvents,
    pageVisits,
    searchHistory,
    offerHistory,
    emailInteractions,
    sessionHistory,
    engagementScore: Math.floor(Math.random() * 100), // 0-100 score
    lastActive: randomDate()
  };
};

// Activity Detail Display Component
const ActivityDetail = ({ activity, onBack }) => {
  const activityTypes = {
    propertyViews: {
      title: "Property Views",
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
          <div className="text-sm italic mt-1">{item.details}</div>
        </div>
      )
    },
    clickEvents: {
      title: "Click Events",
      icon: <MousePointer className="h-5 w-5 text-purple-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.element}</div>
          <div className="text-sm text-gray-500">{item.page}</div>
          <div className="text-sm mt-1">{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</div>
        </div>
      )
    },
    pageVisits: {
      title: "Page Visits",
      icon: <Navigation className="h-5 w-5 text-green-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.url}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
        </div>
      )
    },
    searchHistory: {
      title: "Search History",
      icon: <Search className="h-5 w-5 text-orange-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">"{item.query}"</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>{item.results} results</span>
          </div>
        </div>
      )
    },
    offerHistory: {
      title: "Offer History",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1">
            <span className="font-bold">${item.amount.toLocaleString()}</span>
            <Badge className={`
              ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${item.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
              ${item.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
              ${item.status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
            `}>
              {item.status}
            </Badge>
          </div>
          <div className="text-sm mt-1">{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</div>
        </div>
      )
    },
    emailInteractions: {
      title: "Email Interactions",
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
      render: (item) => (
        <div key={item.emailId} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.subject}</div>
          <div className="flex mt-1 text-sm">
            <span className={`${item.opened ? 'text-green-600' : 'text-gray-500'}`}>
              {item.opened ? 'Opened' : 'Not opened'}
              {item.opened && ` on ${format(new Date(item.openTimestamp), 'MMM d, yyyy h:mm a')}`}
            </span>
          </div>
          {item.clicks.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <div className="text-sm font-medium">Clicked Links:</div>
              {item.clicks.map((click, idx) => (
                <div key={idx} className="text-sm ml-2">
                  • {click.url} ({format(new Date(click.timestamp), 'h:mm a')})
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    sessionHistory: {
      title: "Session History",
      icon: <Smartphone className="h-5 w-5 text-gray-500" />,
      render: (item) => (
        <div key={item.loginTime} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.device}</div>
          <div className="text-sm text-gray-500">IP: {item.ipAddress}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>Login: {format(new Date(item.loginTime), 'MMM d, yyyy h:mm a')}</span>
            <span>Logout: {format(new Date(item.logoutTime), 'h:mm a')}</span>
          </div>
          <div className="text-sm mt-1">
            Duration: {Math.round((new Date(item.logoutTime) - new Date(item.loginTime)) / 60000)} minutes
          </div>
        </div>
      )
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          {activityTypes[activity.type]?.icon && (
            <span className="mr-2">{activityTypes[activity.type].icon}</span>
          )}
          {activityTypes[activity.type]?.title || "Activity"}
        </h3>
        <Button variant="outline" size="sm" onClick={onBack}>
          Back to Summary
        </Button>
      </div>
      
      <div className="space-y-2">
        {activity.data.length > 0 ? (
          activity.data.map(item => activityTypes[activity.type].render(item))
        ) : (
          <div className="text-center p-4 text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
};

// Activity Summary Component
const ActivitySummary = ({ activity, onViewDetail }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Eye className="h-4 w-4 mr-2 text-blue-500" />
              Property Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Properties viewed:</span>
              <Badge variant="outline" className="bg-blue-50">
                {activity.propertyViews.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total view time:</span>
              <span className="text-sm font-medium">
                {Math.floor(activity.propertyViews.reduce((total, view) => total + view.duration, 0) / 60)} minutes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Most viewed property:</span>
              {activity.propertyViews.length > 0 ? (
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {activity.propertyViews[0].propertyTitle}
                </span>
              ) : (
                <span className="text-sm text-gray-500">None</span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            onClick={() => onViewDetail({
              type: "propertyViews",
              data: activity.propertyViews
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Offer Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Offers made:</span>
              <Badge variant="outline" className="bg-green-50">
                {activity.offerHistory.length}
              </Badge>
            </div>
            {activity.offerHistory.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest offer:</span>
                  <span className="text-sm font-medium">
                    ${activity.offerHistory[0].amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest status:</span>
                  <Badge className={`
                    ${activity.offerHistory[0].status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${activity.offerHistory[0].status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                    ${activity.offerHistory[0].status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                    ${activity.offerHistory[0].status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {activity.offerHistory[0].status}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No offers made yet</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]" 
            disabled={activity.offerHistory.length === 0}
            onClick={() => onViewDetail({
              type: "offerHistory",
              data: activity.offerHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-purple-500" />
              Interaction Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Click events:</span>
              <Badge variant="outline" className="bg-purple-50">
                {activity.clickEvents.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Page visits:</span>
              <Badge variant="outline" className="bg-green-50">
                {activity.pageVisits.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last active:</span>
              <span className="text-sm font-medium">
                {format(new Date(activity.lastActive), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              onClick={() => onViewDetail({
                type: "clickEvents",
                data: activity.clickEvents
              })}
            >
              Click Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              onClick={() => onViewDetail({
                type: "pageVisits",
                data: activity.pageVisits
              })}
            >
              Visit Details
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Search className="h-4 w-4 mr-2 text-orange-500" />
              Search Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total searches:</span>
              <Badge variant="outline" className="bg-orange-50">
                {activity.searchHistory.length}
              </Badge>
            </div>
            {activity.searchHistory.length > 0 ? (
              <>
                <div>
                  <div className="text-sm mb-1">Recent searches:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.searchHistory.slice(0, 2).map((search, idx) => (
                      <Badge key={idx} variant="outline" className="bg-orange-50">
                        {search.query}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No search history</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.searchHistory.length === 0}
            onClick={() => onViewDetail({
              type: "searchHistory",
              data: activity.searchHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-indigo-500" />
              Email Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emails received:</span>
              <Badge variant="outline" className="bg-indigo-50">
                {activity.emailInteractions.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Open rate:</span>
              <span className="text-sm font-medium">
                {activity.emailInteractions.length > 0 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.opened).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Click rate:</span>
              <span className="text-sm font-medium">
                {activity.emailInteractions.length > 0 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.clicks.length > 0).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.emailInteractions.length === 0}
            onClick={() => onViewDetail({
              type: "emailInteractions",
              data: activity.emailInteractions
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
              Session Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total sessions:</span>
              <Badge variant="outline" className="bg-gray-50">
                {activity.sessionHistory.length}
              </Badge>
            </div>
            {activity.sessionHistory.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last login:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(activity.sessionHistory[0].loginTime), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Device:</span>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {activity.sessionHistory[0].device.split(' ')[0]}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No session data</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.sessionHistory.length === 0}
            onClick={() => onViewDetail({
              type: "sessionHistory",
              data: activity.sessionHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Activity tab for user activity tracking
const ActivityTab = ({ buyer }) => {
  const [viewMode, setViewMode] = useState("summary");
  const [detailActivity, setDetailActivity] = useState(null);
  
  // Generate activity data for this buyer if it doesn't exist
  const activity = useMemo(() => {
    return generateActivityData(buyer.id, buyer.firstName, buyer.lastName);
  }, [buyer.id, buyer.firstName, buyer.lastName]);
  
  const handleViewDetail = (activityData) => {
    setDetailActivity(activityData);
    setViewMode("detail");
  };
  
  const handleBackToSummary = () => {
    setDetailActivity(null);
    setViewMode("summary");
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Buyer Activity Dashboard</CardTitle>
            <CardDescription>
              Detailed tracking of user engagement and behavior
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#324c48] px-3 py-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last active: {format(new Date(activity.lastActive), 'MMM d, yyyy')}</span>
            </Badge>
            <div className="flex items-center">
              <div className="font-bold text-lg mr-2">{activity.engagementScore}</div>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    activity.engagementScore >= 80 ? 'bg-green-500' :
                    activity.engagementScore >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${activity.engagementScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "summary" ? (
          <ActivitySummary activity={activity} onViewDetail={handleViewDetail} />
        ) : (
          <ActivityDetail activity={detailActivity} onBack={handleBackToSummary} />
        )}
      </CardContent>
    </Card>
  );
};

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
  
  // Store selected buyer for activity view
  const [selectedBuyerForActivity, setSelectedBuyerForActivity] = useState(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

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

    // Initialize area counts to zero
    AREAS.forEach(area => {
      newStats.byArea[area.id] = 0;
    });

    // Count buyers by area - fixed to properly match lowercase area values
    buyersList.forEach(buyer => {
      if (buyer.preferredAreas && Array.isArray(buyer.preferredAreas)) {
        buyer.preferredAreas.forEach(area => {
          // Find the area object that matches the lowercase area value
          const areaObj = AREAS.find(a => 
            a.value === area.toLowerCase() || 
            a.id.toLowerCase() === area.toLowerCase()
          );
          
          if (areaObj) {
            newStats.byArea[areaObj.id]++;
          }
        });
      }
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
        const areaValue = AREAS.find(a => a.id === areaFilter)?.value || areaFilter.toLowerCase();
        results = results.filter(buyer => 
          buyer.preferredAreas && buyer.preferredAreas.some(area => 
            area.toLowerCase() === areaValue
          )
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

  // Get buyers for a specific area with proper case-insensitive matching
  const getBuyersForArea = (areaId) => {
    const areaValue = AREAS.find(a => a.id === areaId)?.value || areaId.toLowerCase();
    return buyers.filter(b => 
      b.preferredAreas && b.preferredAreas.some(area => 
        area.toLowerCase() === areaValue
      )
    );
  };
  
  // Handle view activity
  const handleViewActivity = (buyer) => {
    setSelectedBuyerForActivity(buyer);
    setActivityDialogOpen(true);
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
          <TabsTrigger value="activity" className="data-[state=active]:bg-white">
            Activity Tracking
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
                        const lastActive = new Date();
                        lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 30));
                        
                        return (
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
                                    onClick={() => handleViewActivity(buyer)}
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
                                  <DropdownMenuItem onClick={() => handleViewActivity(buyer)}>
                                    View Activity
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
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
                  const areaBuyers = getBuyersForArea(area.id);
                  
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
                                document.querySelector('[data-state="inactive"][value="list"]')?.click();
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
                            const buyersForArea = getBuyersForArea(area.id);
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
        
        {/* Activity Tracking Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Tracking</CardTitle>
              <CardDescription>
                View and analyze detailed user engagement with your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Activity Metrics Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-[#f0f5f4] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-5 w-5 text-[#324c48]" />
                          <span className="font-medium">Property Views</span>
                        </div>
                        <div className="text-2xl font-bold">378</div>
                        <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
                      </div>
                      
                      <div className="bg-[#f0f5f4] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MousePointer className="h-5 w-5 text-[#324c48]" />
                          <span className="font-medium">Click Events</span>
                        </div>
                        <div className="text-2xl font-bold">1,293</div>
                        <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
                      </div>
                      
                      <div className="bg-[#f0f5f4] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-[#324c48]" />
                          <span className="font-medium">Avg. Session Time</span>
                        </div>
                        <div className="text-2xl font-bold">12m 33s</div>
                        <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
                      </div>
                      
                      <div className="bg-[#f0f5f4] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-[#324c48]" />
                          <span className="font-medium">Offers Made</span>
                        </div>
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Most Active Buyers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buyers.slice(0, 6).map(buyer => {
                    // Generate random activity data
                    const activityScore = Math.floor(parseInt(buyer.id.substring(0, 8), 16) % 100);
                    const lastActive = new Date();
                    lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 30));
                    
                    return (
                      <Card key={buyer.id} className="border border-[#324c48]/20">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-base">{buyer.firstName} {buyer.lastName}</CardTitle>
                              <CardDescription className="text-xs">{buyer.email}</CardDescription>
                            </div>
                            <Badge 
                              className={`${
                                activityScore >= 80 ? 'bg-green-100 text-green-800' :
                                activityScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {activityScore}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Last active:</span>
                              <span>{format(lastActive, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Properties viewed:</span>
                              <span>{Math.floor(Math.random() * 10) + 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Offers made:</span>
                              <span>{Math.floor(Math.random() * 3)}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full mt-3 bg-[#324c48] text-white"
                            onClick={() => handleViewActivity(buyer)}
                          >
                            View Activity
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-3">Recent Property Views</h3>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Generate sample property view data */}
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const buyer = buyers[Math.floor(Math.random() * buyers.length)];
                          const properties = [
                            { id: "residency1", title: "Modern Apartment", address: "123 Main Street, Metropolis, USA" },
                            { id: "residency2", title: "Luxury Villa", address: "456 Ocean Drive, Seaside, USA" },
                            { id: "residency3", title: "Mountain Cabin", address: "789 Pine Road, Highland, USA" }
                          ];
                          const property = properties[Math.floor(Math.random() * properties.length)];
                          const viewDate = new Date();
                          viewDate.setDate(viewDate.getDate() - Math.floor(Math.random() * 7));
                          const duration = Math.floor(Math.random() * 600) + 30; // 30 seconds to 10 minutes
                          
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <div className="font-medium">{buyer.firstName} {buyer.lastName}</div>
                                <div className="text-xs text-gray-500">{buyer.email}</div>
                              </TableCell>
                              <TableCell>
                                <div>{property.title}</div>
                                <div className="text-xs text-gray-500">{property.address}</div>
                              </TableCell>
                              <TableCell>
                                {format(viewDate, 'MMM d, yyyy h:mm a')}
                              </TableCell>
                              <TableCell>
                                {Math.floor(duration / 60)}m {duration % 60}s
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs h-7 border-[#324c48] text-[#324c48]"
                                  onClick={() => handleViewActivity(buyer)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
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
                              style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
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
      
      {/* Activity Detail Dialog */}
      <Dialog 
        open={activityDialogOpen} 
        onOpenChange={setActivityDialogOpen}
        className="max-w-4xl"
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Buyer Activity Dashboard</DialogTitle>
            <DialogDescription>
              {selectedBuyerForActivity && (
                <>Detailed activity for {selectedBuyerForActivity.firstName} {selectedBuyerForActivity.lastName}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-y-auto">
            {selectedBuyerForActivity && (
              <ActivityTab buyer={selectedBuyerForActivity} />
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActivityDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}