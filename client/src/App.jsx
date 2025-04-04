import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material/styles"; // Import MUI ThemeProvider
import theme from "./theme"; // Our custom theme with colors
import Layout from "./components/Layout/Layout"; // Your layout component
import AdminLayout from "./components/Layout/AdminLayout"; // New Admin Layout component
import Site from "./pages/Site"; // Home page
import Properties from "./pages/Properties/Properties"; // Properties listing page
import Property from "./pages/Property/Property"; // Property detail page
import Offer from "./components/Offer/Offer"; // Offer component
import AddProperty from "./pages/AddProperty/AddProperty"; // Add Property page
import { UserProvider } from "./utils/UserContext"; // User context provider
import EditProperty from "./pages/EditProperty/EditProperty"; // Edit Property page
import DFW from "./pages/DFW/DFW"; // DFW Property page
import Austin from "./pages/Austin/Austin"; // Austin Property page
import Houston from "./pages/Houston/Houston"; // Houston Property page
import SanAntonio from "./pages/SanAntonio/SanAntonio"; // San Antonio Property page
import OtherLands from "./pages/OtherLands/OtherLands"; // Other Lands Property page
import Financing from "./pages/Financing/Financing";
import AboutUs from "./pages/AboutUs/AboutUs";
import Support from "./pages/Support/Support";
import Search from "./components/Search/Search";
import Admin from "./pages/Admin/Admin";
import OfferTable from "./components/OfferTable/OfferTable";
import CreateUser from "./pages/CreateUser/CreateUser";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Sell from "./pages/Sell/Sell";
import Qualify from "./pages/Qualify/Qualify";
import QualificationsDashboard from "./components/QualificationsDashboard/QualificationsDashboard";
import Subscription from "./pages/Subscription/Subscription"; // Import our new Subscription page
import VipSignupForm from "./pages/Subscription/VipSignupForm"; // VIP signup form
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import UserDetail from "./components/UserDetail/UserDetail";
import AdminBuyers from "./pages/AdminBuyers/AdminBuyers";
import BuyerDetail from "./components/BuyerDetail/BuyerDetail";
import CreateBuyer from "./components/CreateBuyer/CreateBuyer";
import EditBuyer from "./components/EditBuyer/EditBuyer";
import BuyerOffers from "./components/BuyerOffers/BuyerOffers";
import BuyerLists from "./components/BuyerLists/BuyerLists";

// Import "react-toastify/dist/ReactToastify.css" for toast styling
import "react-toastify/dist/ReactToastify.css";

// Create the React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        {/* Wrap the app with MUI ThemeProvider for consistent styling */}
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {/* Scroll to top on route change */}
            <ScrollToTop />
            <Routes>
              {/* Main site routes with standard layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Site />} />
                <Route path="/properties">
                  <Route index element={<Properties />} />
                  <Route path=":propertyId" element={<Property />} />
                  <Route path=":propertyId/offers" element={<OfferTable />} />
                  <Route path=":propertyId/qualify" element={<Qualify />} />
                </Route>
                <Route path="/sell" element={<Sell />} />
                <Route path="/financing" element={<Financing />} />
                <Route path="/support" element={<Support />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/vip-signup" element={<VipSignupForm />} />
                <Route path="/DFW" element={<DFW />} />
                <Route path="/Austin" element={<Austin />} />
                <Route path="/Houston" element={<Houston />} />
                <Route path="/SanAntonio" element={<SanAntonio />} />
                <Route path="/OtherLands" element={<OtherLands />} />
                <Route path="/qualify" element={<Qualify />} />
                <Route path="/CreateUservbtwP44jbX0FKKYUdHBGGCcYqenvNlYdH1Sj7K1dSD3kRo1Pib5VXQWb59a7CkQZ4DiQuu5r1t9I0uXVUbYjvvj4E1djRIkXRh40Uvbz2jSz6PZKguOjGhi7avF1b" element={<CreateUser />} />
              </Route>

              {/* Admin routes with AdminLayout */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/:userId" element={<UserDetail />} />
                <Route path="/admin/buyers" element={<AdminBuyers />} />
                <Route path="/admin/buyers/create" element={<CreateBuyer />} />
                <Route path="/admin/buyers/:buyerId" element={<BuyerDetail />} />
                <Route path="/admin/buyers/:buyerId/edit" element={<EditBuyer />} />
                <Route path="/admin/buyers/:buyerId/offers" element={<BuyerOffers />} />
                <Route path="/admin/buyer-lists" element={<BuyerLists />} />
                <Route path="/admin/qualifications" element={<QualificationsDashboard />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/edit-property/:propertyId" element={<EditProperty />} />
                <Route path="/financing/applications" element={<OfferTable />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
        {/* Toast notifications container */}
        <ToastContainer />
        {/* React Query DevTools for debugging */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;