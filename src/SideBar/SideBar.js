import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import makeStyles from "@mui/styles/makeStyles";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MoneyIcon from "@mui/icons-material/Money";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  icons: {
    color: theme.palette.secondary.main,
  },
}));

const SideBar = (props) => {
  const classes = useStyles();
  const { window } = props;

  const [path, setPath] = useState("");

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    setPath(location.pathname);
  }, [location, setPath]);

  const activetRoute = (route) => {
    return route === path;
  };

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  const listOfPages = [
    { name: "Home", icon: <HomeIcon />, link: "/" },
    { name: "Accounts", icon: <AccountBalanceIcon />, link: "/accounts" },
    { name: "Expenses", icon: <CreditCardIcon />, link: "/expenses" },
    { name: "Income", icon: <MoneyIcon />, link: "/income" },
    { name: "Transfers", icon: <ImportExportIcon />, link: "/transfers" },
    { name: "History", icon: <HistoryIcon />, link: "/history" },
    { name: "Categories", icon: <CategoryIcon />, link: "/categories" },
  ];

  const pages = listOfPages.map((page) => {
    return (
      <ListItemLink
        key={page.name}
        href={page.link}
        selected={activetRoute(page.link)}
      >
        <ListItemIcon className={classes.icons}>{page.icon}</ListItemIcon>
        <ListItemText primary={page.name} />
      </ListItemLink>
    );
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <div>
            <List>{pages}</List>
          </div>
          <Divider />
        </Drawer>

        <Drawer
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          variant="permanent"
          open
        >
          <div>
            <List>{pages}</List>
            <Divider />
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                history.push("/login");
              }}
            >
              <ListItemIcon className={classes.icons}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </div>
        </Drawer>
      </Box>
    </Box>
  );
};

export default SideBar;
