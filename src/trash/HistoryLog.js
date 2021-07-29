import React from 'react';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const HistoryLog = (props) => {
    return (
        <div>
            <List>
                <ListItem alignItems="center">
                    <ListItemText>{props.transaction}</ListItemText>
                </ListItem>
            </List>
        </div>
    );
};

export default HistoryLog;