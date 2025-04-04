import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  FileText,
  Home,
  Users,
  Star,
  Settings,
  ChevronRight,
  LandPlot,
  UserPlus,
  ListChecks,
  BarChart3,
  Mail,
  Tags
} from "lucide-react";

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    properties: true,
    users: false,
    buyers: false,
    campaigns: false,
    settings: false,
  });

  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => {
    return currentPath === path;
  };

  const isMenuActive = (paths) => {
    return paths.some(path => currentPath.includes(path));
  };

  return (
    <div className="w-72 bg-[#FDF8F2] border-r border-[#324c48]/20 h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="text-[#324c48] font-bold text-xl">Landivo Dashboard</span>
        </Link>

        <div className="space-y-1">
          {/* Dashboard */}
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
              isActive("/admin") && "bg-[#324c48]/10 font-medium"
            )}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          {/* Properties Section */}
          <div>
            <button
              onClick={() => toggleMenu("properties")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                isMenuActive(["/admin/properties", "/properties", "/add-property"]) && "bg-[#324c48]/10 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <LandPlot size={18} />
                <span>Properties</span>
              </div>
              {openMenus.properties ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.properties && (
              <div className="ml-7 mt-1 space-y-1 border-l border-[#324c48]/20 pl-3">
                <Link
                  to="/properties"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/properties") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  All Properties
                </Link>
                <Link
                  to="/add-property"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/add-property") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Add Property
                </Link>
                <Link
                  to="/admin/qualifications"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/qualifications") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Qualifications
                </Link>
                <Link
                  to="/financing/applications"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/financing/applications") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Financing Applications
                </Link>
                <Link
                  to="/admin/starred"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/starred") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Starred
                </Link>
              </div>
            )}
          </div>

          {/* Users Section */}
          <div>
            <button
              onClick={() => toggleMenu("users")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                isMenuActive(["/admin/users"]) && "bg-[#324c48]/10 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <Users size={18} />
                <span>Users</span>
              </div>
              {openMenus.users ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.users && (
              <div className="ml-7 mt-1 space-y-1 border-l border-[#324c48]/20 pl-3">
                <Link
                  to="/admin/users"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/users") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  All Users
                </Link>
                <Link
                  to="/admin/users/create"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/users/create") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Add User
                </Link>
              </div>
            )}
          </div>

          {/* Buyers Section */}
          <div>
            <button
              onClick={() => toggleMenu("buyers")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                isMenuActive(["/admin/buyers", "/admin/buyer-lists"]) && "bg-[#324c48]/10 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={18} />
                <span>Buyers</span>
              </div>
              {openMenus.buyers ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.buyers && (
              <div className="ml-7 mt-1 space-y-1 border-l border-[#324c48]/20 pl-3">
                <Link
                  to="/admin/buyers"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/buyers") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Buyers List
                </Link>
                <Link
                  to="/admin/buyers/create"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/buyers/create") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Add Buyer
                </Link>
                <Link
                  to="/admin/buyer-lists"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/buyer-lists") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Buyer Lists
                </Link>
              </div>
            )}
          </div>

          {/* Campaigns Section */}
          <div>
            <button
              onClick={() => toggleMenu("campaigns")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                isMenuActive(["/admin/campaigns"]) && "bg-[#324c48]/10 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>Campaigns</span>
              </div>
              {openMenus.campaigns ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.campaigns && (
              <div className="ml-7 mt-1 space-y-1 border-l border-[#324c48]/20 pl-3">
                <Link
                  to="/admin/campaigns"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/campaigns") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  All Campaigns
                </Link>
                <Link
                  to="/admin/campaigns/create"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/admin/campaigns/create") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  Create Campaign
                </Link>
              </div>
            )}
          </div>

          {/* Analytics */}
          <Link
            to="/admin/analytics"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
              isActive("/admin/analytics") && "bg-[#324c48]/10 font-medium"
            )}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>

          {/* Settings Section */}
          <div>
            <button
              onClick={() => toggleMenu("settings")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                isMenuActive(["/settings", "/smtp"]) && "bg-[#324c48]/10 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span>Settings</span>
              </div>
              {openMenus.settings ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.settings && (
              <div className="ml-7 mt-1 space-y-1 border-l border-[#324c48]/20 pl-3">
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/settings") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  General Settings
                </Link>
                <Link
                  to="/smtp-settings"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/smtp-settings") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  SMTP Settings
                </Link>
                <Link
                  to="/api-connection"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#324c48] hover:bg-[#324c48]/10 transition-colors",
                    isActive("/api-connection") && "bg-[#324c48]/10 font-medium"
                  )}
                >
                  API & Connection
                </Link>
              </div>
            )}
          </div>

          {/* Back to Site */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[#324c48] hover:bg-[#324c48]/10 transition-colors mt-8"
          >
            <Home size={18} />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto bg-[#FDF8F2]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;