import React from 'react';
import { Link } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


// const SideBar = () => {
//     return (
//         <Box>
//             <Drawer anchor="left" variant="permanent">
//                 <List component="nav">
//                     {['Accounts', 'Expenses', 'Income', 'History'].map(element => (
//                         <ListItem key={element} button>
//                             <ListItemText primary={element} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </Drawer>
//         </Box>
//     )
// };

const SideBar = () => {
    return (
        <Box>
            <Drawer anchor="left" variant="permanent">
                <List component="nav">
                    <ListItem>
                        <Link to="/accounts">
                            <ListItemText primary="Accounts" />
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