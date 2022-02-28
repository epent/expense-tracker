import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MoneyIcon from "@mui/icons-material/Money";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  icons: {
    color: theme.palette.secondary.main,
  },
}));

const SideBar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { window } = props;

  const [path, setPath] = useState("");

  let location = useLocation();

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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden lgUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div className={classes.drawerContainer}>
              <List component="nav">{pages}</List>
            </div>
          </Drawer>
        </Hidden>
        <Hidden lgDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className={classes.drawerContainer}>
              <List component="nav">{pages}</List>
            </div>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default SideBar;
