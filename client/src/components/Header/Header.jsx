import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkSession, loginUser, logoutUser } from "../../utils/api";
import { UserContext } from "../../utils/UserContext";
import LoginModal from "../LoginModal/LoginModal";
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
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await checkSession();
        if (response.user) {
          setCurrentUser(response.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkUserSession();
  }, [setCurrentUser]);

  const handleLoginData = async ({ email, password }) => {
    try {
      const data = await loginUser({ email, password });
      if (data.user) setCurrentUser(data.user);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Updated logout logic using try/catch/finally
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setCurrentUser(null);
      navigate("/");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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

                  {!currentUser ? (
                    <Button
                      onClick={() => setShowLoginModal(true)}
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

            {/* Login / User Dropdown */}
            {!currentUser ? (
              <Button
                onClick={() => setShowLoginModal(true)}
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
                    {`Welcome, ${currentUser.name}`}
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
                      to="/admin"
                      className="text-[#324c48] hover:text-[#D4A017] cursor-pointer"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-background-200 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-[#FDF8F2] border-t border-gray-200 shadow-md py-4">
          <div className="flex flex-col space-y-2 px-6">
            {["Properties", "Sell", "Financing", "About Us", "Support"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                className="py-2 text-base font-medium text-[#333] hover:text-[#576756]"
              >
                {item}
              </Link>
            ))}

            {!currentUser ? (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="w-full px-5 py-3 text-base font-semibold text-white bg-[#576756] rounded-md hover:bg-[#001530] transition"
              >
                Login / Sign Up
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                className="w-full px-5 py-3 text-base font-semibold text-white bg-[#2C5F2D] rounded-md hover:bg-[#244a20] transition"
              >
                Logout
              </Button>
            )}
          </div>
        </nav>
      )}

      {showLoginModal && (
        <LoginModal
          onSubmit={handleLoginData}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
