import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { UserContext } from "../../utils/UserContext";
import { useContext } from "react";
import { logoutUser } from "../../utils/api";

// Drawer width for the sidebar
const drawerWidth = 240;

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    handleMenuClose();
  };

  // Admin navigation items
  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/admin" },
    { text: "Properties", icon: <BusinessIcon />, path: "/properties" },
    { text: "Add Property", icon: <AddIcon />, path: "/admin/add-property" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Buyers", icon: <PersonIcon />, path: "/admin/buyers" },
    { text: "Buyer Lists", icon: <ViewListIcon />, path: "/admin/buyer-lists" },
    { text: "Qualifications", icon: <AssessmentIcon />, path: "/admin/qualifications" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#324c48",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Landivo Admin
          </Typography>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {currentUser?.image ? (
              <Avatar 
                src={currentUser.image} 
                sx={{ width: 32, height: 32 }}
                alt={currentUser.name} 
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {currentUser?.name || "User"}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
            borderRight: "1px solid #e0e0e0",
            paddingTop: "64px", // Height of AppBar
          },
        }}
        open={open}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e8efdc",
                  borderLeft: "4px solid #3f4f24",
                  "&:hover": {
                    backgroundColor: "#e8efdc",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f4f7ee",
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? "#3f4f24" : "#757575" 
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: location.pathname === item.path ? "#3f4f24" : "#424242",
                  "& .MuiTypography-root": { 
                    fontWeight: location.pathname === item.path ? "bold" : "normal" 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ position: "fixed", bottom: 0, width: drawerWidth, padding: 2, borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="body2" color="textSecondary" align="center">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Back to Site
            </Link>
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` },
          marginTop: "64px", // Height of AppBar
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 64px)", // Full height minus AppBar
        }}
      >
        {/* This renders the current route component */}
        <Outlet />
      </Box>
    </Box>
  );
}