import React from "react";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles } from "@material-ui/core/styles";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CategoryIcon from "@material-ui/icons/Category";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import MoneyIcon from "@material-ui/icons/Money";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
}));

const SideBar = () => {
  const classes = useStyles();

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
      <ListItem button>
        <ListItemIcon>{page.icon}</ListItemIcon>
        <Link href={page.link} variant="body1" underline="none">
          {page.name}
        </Link>
      </ListItem>
    );
  });

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List component="nav">{pages}</List>
        </div>
      </Drawer>
    </div>
  );
};

export default SideBar;
