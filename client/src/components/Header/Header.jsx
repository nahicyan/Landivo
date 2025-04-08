import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth0 hooks provide authentication state and methods
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isAuthenticated, 
    isLoading 
  } = useAuth0();

  // Update UserContext with Auth0 user info when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser({
        name: user.name || user.nickname || user.email,
        email: user.email,
        image: user.picture,
        // Map additional user properties as needed
      });
    }
  }, [isAuthenticated, user, setCurrentUser]);

  // Handler for login button click
  const handleLogin = () => {
    loginWithRedirect();
  };

  // Handler for logout button click
  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
    // Clear user from context
    setCurrentUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F2] border-b border-[#e3a04f] shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" title="Landivo">
              <img
                className="w-auto h-10 lg:h-12"
                src="https://shinyhomes.net/wp-content/uploads/2025/02/Landivo.svg"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#324c48]" />
                  ) : (
                    <Menu className="w-6 h-6 text-[#324c48]" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#FDF8F2] border-r border-[#e3a04f]"
              >
                <div className="space-y-4">
                  {[
                    "Properties",
                    "Sell",
                    "Financing",
                    "About Us",
                    "Support",
                  ].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="block text-lg font-medium text-[#324c48] hover:text-[#D4A017]"
                    >
                      {item}
                    </Link>
                  ))}

                  {isLoading ? (
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  ) : !isAuthenticated ? (
                    <Button
                      onClick={handleLogin}
                      className="w-full bg-[#3f4f24] text-white hover:bg-[#2c3b18]"
                    >
                      Login / Sign Up
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-[#324c48] text-white hover:bg-[#253838]"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-6">
                {[
                  { name: "Properties", path: "/properties" },
                  { name: "Sell", path: "/sell" },
                  { name: "Financing", path: "/financing" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Support", path: "/support" },
                ].map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="text-base font-medium text-[#324c48] hover:text-[#D4A017] transition"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth0 Login Button or User Profile */}
            {isLoading ? (
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
            ) : !isAuthenticated ? (
              <Button
                onClick={handleLogin}
                className="bg-[#3f4f24] text-white hover:bg-[#2c3b18]"
              >
                Login / Sign Up
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-[#3f4f24] hover:text-[#D4A017] flex items-center"
                  >
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name || "Profile"} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <User className="w-5 h-5 mr-2" />
                    )}
                    <span className="max-w-[150px] truncate">
                      {user?.name || user?.nickname || user?.email}
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 -mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#FDF8F2] border border-[#e3a04f] shadow-lg"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="text-[#324c48] hover:text-[#D4A017] cursor-pointer flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Conditionally show admin dashboard link if user has admin role */}
                  {user && user['https://landivo.com/roles']?.includes('admin') && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="text-[#324c48] hover:text-[#D4A017] cursor-pointer"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-background-200 cursor-pointer flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>

      {/* Removed mobile menu as it's now handled by Sheet component */}

    </header>
  );
};

export default Header;