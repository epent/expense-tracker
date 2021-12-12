import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CategoryIcon from "@material-ui/icons/Category";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import MoneyIcon from "@material-ui/icons/Money";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

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
          >
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
        <Hidden mdDown implementation="css">
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
