import React from 'react';
// import { Link } from "react-router-dom";

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import HistoryIcon from '@material-ui/icons/History';
import HomeIcon from '@material-ui/icons/Home';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MoneyIcon from '@material-ui/icons/Money';




const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
}));

const SideBar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>

            {/* <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Expense Tracker
                    </Typography>
                </Toolbar>
            </AppBar> */}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List component="nav">
                    <ListItem button>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <Link href="/home" variant="body1" underline="none">
                            Home
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
                        <Link href="/accounts" variant="body1" underline="none">
                            Accounts
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><CreditCardIcon /></ListItemIcon>
                        <Link href="/expenses" variant="body1" underline="none">
                            Expenses
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><MoneyIcon /></ListItemIcon>
                        <Link href="/income" variant="body1" underline="none">
                            Income
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><ImportExportIcon /></ListItemIcon>
                        <Link href="/transfers" variant="body1" underline="none">
                            Transfers
                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <Link href="/history" variant="body1" underline="none">
                            History
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};

export default SideBar;