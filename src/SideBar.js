import React from 'react';
import { Link } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const SideBar = () => {
    return (
        <Box>
            <Drawer anchor="left" variant="permanent">
                <List component="nav">
                    <ListItem>
                        <Link to="/home">
                            <ListItemText primary="Home" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/expenses">
                            <ListItemText primary="Expenses" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/income">
                            <ListItemText primary="Income" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/transfers">
                            <ListItemText primary="Transfers" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/history">
                            <ListItemText primary="History" />
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    )
};

export default SideBar;